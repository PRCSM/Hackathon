# AI Processing Pipeline

This directory contains the AWS Lambda function that processes uploaded
educational materials through the AI pipeline.

## Pipeline Flow

```
S3 Upload → Lambda Trigger → Textract (OCR) → Comprehend (Key Phrases)
  → Bedrock Nova Premier (Quiz + Explanation + Flashcard Generation)
  → SageMaker (Confidence Scoring)
  → Translate (Multilingual)
  → PostgreSQL (Store Results)
  → Notify Teacher (Content Ready)
```

## Deployment

```bash
# Package Lambda
cd lambda
pip install -r requirements.txt -t package/
cp handler.py package/
cd package && zip -r ../function.zip . && cd ..

# Deploy
aws lambda update-function-code \
  --function-name padhai-ai-pipeline \
  --zip-file fileb://function.zip
```
