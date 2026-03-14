import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// POST /api/upload/presign — Generate presigned upload URL
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, contentType, classroomId, userId } = body;

    const key = `uploads/${classroomId}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      Metadata: {
        "classroom-id": classroomId,
        "uploaded-by": userId,
      },
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 600 });

    return NextResponse.json({
      uploadUrl: presignedUrl,
      s3Key: key,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
