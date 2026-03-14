import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const BUCKET = process.env.S3_BUCKET_NAME || "padhai-uploads-prod";

// POST /api/upload — Get presigned S3 URL for file upload
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { filename, contentType, classroomId, topicId } = body;

    if (!filename || !contentType) {
      return NextResponse.json({ error: "filename and contentType required" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json({ error: "File type not supported" }, { status: 400 });
    }

    const ext = filename.split(".").pop();
    const userId = session.user.id || "unknown";
    const role = (session.user as { role?: string }).role || "student";

    // Build S3 key based on role
    let s3Key: string;
    if (role === "teacher" && classroomId && topicId) {
      s3Key = `classrooms/${classroomId}/topics/${topicId}/${Date.now()}.${ext}`;
    } else if (role === "student") {
      s3Key = `students/${userId}/self/${Date.now()}.${ext}`;
    } else {
      s3Key = `uploads/${userId}/${Date.now()}.${ext}`;
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({
      uploadUrl: presignedUrl,
      s3Key,
      bucket: BUCKET,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
