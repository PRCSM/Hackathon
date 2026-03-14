"""
PadhAI AI Processing Pipeline — AWS Lambda Handler

Triggered by S3 upload events. Processes educational materials through:
1. Textract (OCR / text extraction)
2. Comprehend (key phrase extraction)
3. Bedrock Nova Premier (quiz, explanation, flashcard generation)
4. SageMaker (difficulty/confidence scoring)
5. Translate (multilingual support)
6. PostgreSQL (store results + notifications)
"""

import json
import os
import time
import urllib.parse
import boto3
import psycopg2
from datetime import datetime

# AWS Clients
s3 = boto3.client("s3")
textract = boto3.client("textract")
comprehend = boto3.client("comprehend")
translate_client = boto3.client("translate")
bedrock = boto3.client("bedrock-runtime")
sagemaker = boto3.client("sagemaker-runtime")

# Config
DB_URL = os.environ.get("DATABASE_URL")
BEDROCK_MODEL = os.environ.get("BEDROCK_MODEL_ID", "amazon.nova-premier-v1:0")
SAGEMAKER_ENDPOINT = os.environ.get("SAGEMAKER_ENDPOINT_NAME", "padhai-confidence-scorer")
SUPPORTED_LANGUAGES = ["hi", "ta", "te", "kn", "mr", "bn", "gu"]


def get_db_connection():
    return psycopg2.connect(DB_URL)


def lambda_handler(event, context):
    """Main Lambda entry point — triggered by S3 PutObject."""
    try:
        record = event["Records"][0]
        bucket = record["s3"]["bucket"]["name"]
        key = urllib.parse.unquote_plus(record["s3"]["object"]["key"])

        print(f"Processing: s3://{bucket}/{key}")

        # Find topic by S3 key
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT id, classroom_id, title, created_by FROM topics WHERE s3_key = %s",
            (key,),
        )
        topic = cur.fetchone()
        if not topic:
            print(f"No topic found for key: {key}")
            return {"statusCode": 404, "body": "Topic not found"}

        topic_id, classroom_id, title, created_by = topic

        # Step 1: Extract text with Textract
        extracted_text = extract_text(bucket, key)
        print(f"Extracted {len(extracted_text)} characters")

        # Step 2: Key phrase extraction with Comprehend
        key_phrases = extract_key_phrases(extracted_text)
        print(f"Found {len(key_phrases)} key phrases")

        # Step 3: Generate content with Bedrock Nova Premier
        ai_content = generate_content(title, extracted_text, key_phrases)
        print("AI content generated")

        # Step 4: Score difficulty with SageMaker
        difficulty_score = score_difficulty(extracted_text, key_phrases)
        difficulty_label = (
            "hard" if difficulty_score > 0.7
            else "medium" if difficulty_score > 0.4
            else "easy"
        )

        # Step 5: Store results
        store_results(
            conn, cur, topic_id, extracted_text, key_phrases,
            ai_content, difficulty_score, difficulty_label
        )

        # Step 6: Translate to supported languages
        translate_content(conn, cur, topic_id, ai_content)

        # Step 7: Notify teacher
        notify_teacher(conn, cur, created_by, title)

        conn.commit()
        cur.close()
        conn.close()

        return {"statusCode": 200, "body": f"Processed topic: {topic_id}"}

    except Exception as e:
        print(f"Pipeline error: {str(e)}")
        # Mark topic as failed
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute(
                "UPDATE topics SET status = 'failed', updated_at = NOW() WHERE s3_key = %s",
                (key,),
            )
            conn.commit()
            cur.close()
            conn.close()
        except Exception:
            pass
        raise e


def extract_text(bucket: str, key: str) -> str:
    """Extract text from document using Textract.

    Uses synchronous detection for images and asynchronous detection for
    multi-page PDFs (which the synchronous API does not support).
    """
    lower_key = key.lower()
    is_pdf = lower_key.endswith(".pdf")

    if is_pdf:
        # Async Textract path — supports multi-page PDFs
        start_response = textract.start_document_text_detection(
            DocumentLocation={"S3Object": {"Bucket": bucket, "Name": key}}
        )
        job_id = start_response["JobId"]

        # Poll until the job completes (Lambda timeout is up to 15 min)
        while True:
            result = textract.get_document_text_detection(JobId=job_id)
            status = result["JobStatus"]
            if status == "SUCCEEDED":
                break
            if status == "FAILED":
                raise RuntimeError(f"Textract async job failed for key: {key}")
            time.sleep(5)

        # Collect text from all pages (handle pagination)
        text_blocks = []
        next_token = None
        while True:
            kwargs = {"JobId": job_id}
            if next_token:
                kwargs["NextToken"] = next_token
            page_result = textract.get_document_text_detection(**kwargs)
            for block in page_result.get("Blocks", []):
                if block["BlockType"] == "LINE":
                    text_blocks.append(block.get("Text", ""))
            next_token = page_result.get("NextToken")
            if not next_token:
                break

        return "\n".join(text_blocks)

    # Synchronous path — images and single-page documents
    response = textract.detect_document_text(
        Document={"S3Object": {"Bucket": bucket, "Name": key}}
    )
    text_blocks = []
    for block in response.get("Blocks", []):
        if block["BlockType"] == "LINE":
            text_blocks.append(block.get("Text", ""))
    return "\n".join(text_blocks)


def extract_key_phrases(text: str) -> list:
    """Extract key phrases using Comprehend."""
    # Comprehend has a 5000 byte limit per call
    chunks = [text[i:i+4900] for i in range(0, len(text), 4900)]
    all_phrases = []

    for chunk in chunks[:5]:  # Max 5 chunks
        response = comprehend.detect_key_phrases(
            Text=chunk, LanguageCode="en"
        )
        for phrase in response.get("KeyPhrases", []):
            if phrase["Score"] > 0.8:
                all_phrases.append(phrase["Text"])

    # Deduplicate and limit
    return list(set(all_phrases))[:30]


def generate_content(title: str, text: str, key_phrases: list) -> dict:
    """Generate quiz, explanation, and flashcards using Bedrock Nova Premier."""
    prompt = f"""You are an expert educational content creator. Given the following educational material,
generate structured learning content.

Title: {title}
Key Concepts: {', '.join(key_phrases[:15])}
Content:
{text[:8000]}

Generate a JSON response with exactly this structure:
{{
  "summary": "A 2-3 sentence summary of the topic",
  "explanation": "A detailed, student-friendly explanation of the key concepts (500-800 words)",
  "quiz": {{
    "title": "Quiz on {title}",
    "questions": [
      {{
        "question_text": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": 0,
        "ai_explanation": "Why this answer is correct",
        "difficulty": "easy|medium|hard"
      }}
    ]
  }},
  "flashcards": [
    {{
      "front_text": "Key term or question",
      "back_text": "Definition or answer"
    }}
  ]
}}

Generate exactly 10 quiz questions (mix of easy, medium, hard) and 8 flashcards.
Return ONLY valid JSON, no other text."""

    response = bedrock.invoke_model(
        modelId=BEDROCK_MODEL,
        contentType="application/json",
        accept="application/json",
        body=json.dumps({
            "messages": [
                {
                    "role": "user",
                    "content": [{"text": prompt}],
                }
            ],
            "inferenceConfig": {
                "maxTokens": 4096,
                "temperature": 0.3,
                "topP": 0.9,
            },
        }),
    )

    response_body = json.loads(response["body"].read())
    generated_text = (
        response_body
        .get("output", {})
        .get("message", {})
        .get("content", [{}])[0]
        .get("text", "{}")
    )

    # Parse JSON from response
    try:
        # Try to find JSON in the response
        start = generated_text.find("{")
        end = generated_text.rfind("}") + 1
        if start >= 0 and end > start:
            content = json.loads(generated_text[start:end])
        else:
            content = json.loads(generated_text)
    except json.JSONDecodeError:
        content = {
            "summary": f"Summary of {title}",
            "explanation": f"AI-generated explanation for {title}.",
            "quiz": {"title": f"Quiz on {title}", "questions": []},
            "flashcards": [],
        }

    return content


def score_difficulty(text: str, key_phrases: list) -> float:
    """Score topic difficulty using SageMaker endpoint."""
    try:
        payload = json.dumps({
            "text_length": len(text),
            "vocabulary_complexity": len(set(text.split())) / max(len(text.split()), 1),
            "key_phrase_count": len(key_phrases),
            "avg_sentence_length": len(text) / max(text.count("."), 1),
        })

        response = sagemaker.invoke_endpoint(
            EndpointName=SAGEMAKER_ENDPOINT,
            ContentType="application/json",
            Body=payload,
        )

        result = json.loads(response["Body"].read())
        return float(result.get("difficulty_score", 0.5))
    except Exception as e:
        print(f"SageMaker scoring failed, using heuristic: {e}")
        # Fallback heuristic
        words = text.split()
        unique_ratio = len(set(words)) / max(len(words), 1)
        return min(unique_ratio * 1.5, 1.0)


def store_results(conn, cur, topic_id, text, key_phrases, content, diff_score, diff_label):
    """Store all generated content in PostgreSQL."""
    # Update topic
    cur.execute(
        """UPDATE topics SET
            extracted_text = %s, key_phrases = %s, ai_summary = %s,
            difficulty_score = %s, difficulty = %s,
            status = 'pending', updated_at = NOW()
        WHERE id = %s""",
        (text, key_phrases, content.get("summary", ""), diff_score, diff_label, topic_id),
    )

    # Store explanation
    cur.execute(
        "INSERT INTO explanations (topic_id, content, language) VALUES (%s, %s, 'en')",
        (topic_id, content.get("explanation", "")),
    )

    # Store quiz
    quiz_data = content.get("quiz", {})
    cur.execute(
        "INSERT INTO quizzes (topic_id, title, language) VALUES (%s, %s, 'en') RETURNING id",
        (topic_id, quiz_data.get("title", f"Quiz")),
    )
    quiz_id = cur.fetchone()[0]

    for i, q in enumerate(quiz_data.get("questions", [])):
        cur.execute(
            """INSERT INTO quiz_questions
               (quiz_id, question_text, options, correct_answer, ai_explanation, difficulty, order_index)
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (
                quiz_id, q["question_text"],
                json.dumps(q["options"]), q["correct_answer"],
                q.get("ai_explanation", ""), q.get("difficulty", "medium"), i,
            ),
        )

    # Store flashcards
    cur.execute(
        "INSERT INTO flashcard_sets (topic_id, title, language) VALUES (%s, %s, 'en') RETURNING id",
        (topic_id, f"Flashcards"),
    )
    set_id = cur.fetchone()[0]

    for i, fc in enumerate(content.get("flashcards", [])):
        cur.execute(
            "INSERT INTO flashcards (set_id, front_text, back_text, order_index) VALUES (%s, %s, %s, %s)",
            (set_id, fc["front_text"], fc["back_text"], i),
        )


def translate_content(conn, cur, topic_id, content):
    """Translate explanation to supported languages using AWS Translate."""
    explanation = content.get("explanation", "")
    if not explanation:
        return

    for lang in SUPPORTED_LANGUAGES:
        try:
            response = translate_client.translate_text(
                Text=explanation[:5000],
                SourceLanguageCode="en",
                TargetLanguageCode=lang,
            )
            translated = response["TranslatedText"]
            cur.execute(
                "INSERT INTO explanations (topic_id, content, language) VALUES (%s, %s, %s)",
                (topic_id, translated, lang),
            )
        except Exception as e:
            print(f"Translation to {lang} failed: {e}")


def notify_teacher(conn, cur, teacher_id, topic_title):
    """Create notification for teacher that content is ready."""
    cur.execute(
        """INSERT INTO notifications (user_id, type, title, message)
           VALUES (%s, 'content_ready', 'Content Ready for Review',
                   %s)""",
        (teacher_id, f'AI has processed "{topic_title}". Please review and approve.'),
    )
