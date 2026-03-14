"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { StatusBadge, Button } from "@/components/shared";
import { ArrowLeft, UploadCloud, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

interface Topic {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface Classroom {
  id: string;
  name: string;
  subject: string;
  grade: string;
}

export default function TeacherTopicsPage() {
  const { data: session } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  // Upload modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadClassroomId, setUploadClassroomId] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTopics = () => {
    fetch("/api/topics")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setTopics(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/classrooms?teacherId=${session.user.id}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setClassrooms(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [session?.user?.id]);

  const openModal = () => {
    setUploadFile(null);
    setUploadTitle("");
    setUploadClassroomId(classrooms[0]?.id || "");
    setUploadDescription("");
    setModalOpen(true);
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Unsupported file type. Please upload a PDF, PPT, or image.");
      return;
    }
    setUploadFile(file);
    if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim() || !uploadClassroomId) {
      toast.error("Please fill in all required fields and select a file.");
      return;
    }
    if (!session?.user?.id) {
      toast.error("You must be logged in to upload.");
      return;
    }

    setUploading(true);
    try {
      // Step 1: Get presigned S3 URL
      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: uploadFile.name,
          contentType: uploadFile.type,
          classroomId: uploadClassroomId,
        }),
      });
      if (!presignRes.ok) {
        const err = await presignRes.json();
        throw new Error(err.error || "Failed to get upload URL");
      }
      const { uploadUrl, s3Key } = await presignRes.json();

      // Step 2: Upload file directly to S3
      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": uploadFile.type },
        body: uploadFile,
      });
      if (!s3Res.ok) throw new Error("Failed to upload file to storage");

      // Step 3: Create topic record in the database
      const topicRes = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classroomId: uploadClassroomId,
          title: uploadTitle.trim(),
          description: uploadDescription.trim() || null,
          createdBy: session.user.id,
          s3Key,
          originalFilename: uploadFile.name,
          fileType: uploadFile.type,
        }),
      });
      if (!topicRes.ok) {
        const err = await topicRes.json();
        throw new Error(err.error || "Failed to create topic");
      }

      toast.success("File uploaded! AI is processing your content…");
      setModalOpen(false);
      fetchTopics();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const statusMap: Record<string, "approved" | "pending" | "processing"> = {
    approved: "approved", pending: "pending", processing: "processing", failed: "pending",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <a href="/dashboard/teacher" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
            <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
          </a>
          <div>
            <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Topics</h1>
            <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Manage uploaded educational content</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={openModal}>
          <UploadCloud size={16} /> Upload Material
        </Button>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading…</p>
      ) : topics.length > 0 ? (
        <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <div className="space-y-2">
            {topics.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={18} style={{ color: "var(--color-forest)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{t.title}</p>
                    <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <StatusBadge status={statusMap[t.status] || "pending"} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <FileText size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No topics uploaded yet</p>
          <p className="text-xs mt-1 mb-4" style={{ color: "var(--color-ink-subtle)" }}>Upload a PDF or document to generate AI-powered quizzes and flashcards</p>
          <Button variant="primary" size="sm" onClick={openModal}>
            <UploadCloud size={16} /> Upload Material
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div
            className="w-full max-w-lg rounded-2xl p-6 shadow-xl"
            style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", border: "1px solid var(--color-border)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold" style={{ color: "var(--color-ink)" }}>Upload Learning Material</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors"
                aria-label="Close modal"
              >
                <X size={20} style={{ color: "var(--color-ink-muted)" }} />
              </button>
            </div>

            {/* File Drop Zone */}
            <div
              className="mb-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
              style={{
                borderColor: dragOver ? "var(--color-forest)" : "var(--color-border)",
                backgroundColor: dragOver ? "rgba(45,74,30,0.04)" : "transparent",
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFileChange(e.dataTransfer.files[0] ?? null);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
              {uploadFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText size={20} style={{ color: "var(--color-forest)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{uploadFile.name}</span>
                </div>
              ) : (
                <>
                  <UploadCloud size={32} className="mx-auto mb-2" style={{ color: "var(--color-ink-subtle)" }} />
                  <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
                    Drag &amp; drop or <span style={{ color: "var(--color-forest)" }}>browse</span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>PDF, PPT, PPTX, JPEG, PNG, WebP</p>
                </>
              )}
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-ink)" }}>
                Title <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Photosynthesis — Chapter 3"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-card)",
                  color: "var(--color-ink)",
                }}
              />
            </div>

            {/* Classroom */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-ink)" }}>
                Classroom <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              {classrooms.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--color-ink-subtle)" }}>
                  No classrooms found.{" "}
                  <a href="/dashboard/teacher/classrooms" style={{ color: "var(--color-forest)" }}>Create one first.</a>
                </p>
              ) : (
                <select
                  value={uploadClassroomId}
                  onChange={(e) => setUploadClassroomId(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-card)",
                    color: "var(--color-ink)",
                  }}
                >
                  <option value="">Select classroom…</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.subject} (Grade {c.grade})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Description (optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-ink)" }}>
                Description <span style={{ color: "var(--color-ink-subtle)" }}>(optional)</span>
              </label>
              <textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Brief description of the material…"
                rows={2}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-card)",
                  color: "var(--color-ink)",
                }}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)} disabled={uploading}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpload}
                disabled={uploading || !uploadFile || !uploadTitle.trim() || !uploadClassroomId}
              >
                {uploading ? "Uploading…" : <><UploadCloud size={16} /> Upload</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
