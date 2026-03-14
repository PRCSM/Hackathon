"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Plus, BookOpen, Users, Upload, CheckCircle, XCircle, Clock, RefreshCcw, Edit2 } from "lucide-react";
import { Button, StatusBadge } from "@/components/shared";

interface Classroom {
  id: string;
  name: string;
  grade: string;
  section: string;
  subject: string;
  studentCount: number;
}

interface Topic {
  id: string;
  title: string;
  status: string;
  ai_summary: string | null;
  difficulty: string | null;
  created_at: string;
}

interface CreateClassroomModal {
  show: boolean;
  name: string;
  grade: string;
  section: string;
  subject: string;
  saving: boolean;
}

export default function TeacherClassroomsPage() {
  const { data: session } = useSession();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [modal, setModal] = useState<CreateClassroomModal>({ show: false, name: "", grade: "", section: "A", subject: "", saving: false });
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", file: null as File | null, uploading: false });

  const fetchClassrooms = () => {
    const teacherId = (session?.user as { id?: string })?.id;
    if (!teacherId) return;
    fetch(`/api/classrooms?teacherId=${teacherId}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        setClassrooms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchClassrooms(); }, [session]);

  const fetchTopics = (classroomId: string) => {
    setTopicsLoading(true);
    fetch(`/api/topics?classroomId=${classroomId}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setTopics(Array.isArray(data) ? data : []); setTopicsLoading(false); })
      .catch(() => setTopicsLoading(false));
  };

  const handleSelectClassroom = (c: Classroom) => {
    setSelectedClassroom(c);
    fetchTopics(c.id);
  };

  const handleCreateClassroom = async () => {
    const teacherId = (session?.user as { id?: string })?.id;
    if (!teacherId || !modal.name || !modal.grade || !modal.subject) return;
    setModal((m) => ({ ...m, saving: true }));

    await fetch("/api/classrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: modal.name, grade: modal.grade, section: modal.section, subject: modal.subject, teacherId, academicYear: "2025-26" }),
    });

    setModal({ show: false, name: "", grade: "", section: "A", subject: "", saving: false });
    fetchClassrooms();
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !selectedClassroom) return;
    setUploadForm((f) => ({ ...f, uploading: true }));

    try {
      // 1. Create topic record
      const teacherId = (session?.user as { id?: string })?.id;
      const topicRes = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classroomId: selectedClassroom.id,
          title: uploadForm.title || uploadForm.file.name,
          createdBy: teacherId,
          originalFilename: uploadForm.file.name,
          fileType: uploadForm.file.type,
        }),
      });
      const topic = await topicRes.json();

      // 2. Get presigned URL
      const urlRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: uploadForm.file.name,
          contentType: uploadForm.file.type,
          classroomId: selectedClassroom.id,
          topicId: topic.id,
        }),
      });
      const { uploadUrl, s3Key } = await urlRes.json();

      // 3. Upload to S3
      await fetch(uploadUrl, { method: "PUT", body: uploadForm.file });

      // 4. Update topic with S3 key
      await fetch(`/api/topics/${topic.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ s3Key }),
      });

      setUploadModal(false);
      setUploadForm({ title: "", file: null, uploading: false });
      fetchTopics(selectedClassroom.id);
    } catch (e) {
      console.error("Upload failed:", e);
      setUploadForm((f) => ({ ...f, uploading: false }));
    }
  };

  const handleApprove = async (topicId: string) => {
    await fetch(`/api/topics/${topicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    if (selectedClassroom) fetchTopics(selectedClassroom.id);
  };

  const handleReject = async (topicId: string) => {
    await fetch(`/api/topics/${topicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    });
    if (selectedClassroom) fetchTopics(selectedClassroom.id);
  };

  const handleRegenerate = async (topicId: string) => {
    await fetch(`/api/topics/${topicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "regenerate" }),
    });
    if (selectedClassroom) fetchTopics(selectedClassroom.id);
  };

  const statusMap: Record<string, "approved" | "pending" | "processing"> = {
    approved: "approved", pending: "pending", processing: "processing", failed: "pending", rejected: "pending",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-bg)",
    color: "var(--color-ink)",
    fontSize: "14px",
    outline: "none",
  };

  if (selectedClassroom) {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedClassroom(null)} className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
              <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
            </button>
            <div>
              <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>{selectedClassroom.name}</h1>
              <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
                {selectedClassroom.subject} • Grade {selectedClassroom.grade}-{selectedClassroom.section} • {selectedClassroom.studentCount} students
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => setUploadModal(true)}>
            <Upload size={16} /> Upload Material
          </Button>
        </div>

        {/* Topics list with approval actions */}
        {topicsLoading ? (
          <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading topics...</p>
        ) : topics.length > 0 ? (
          <div className="space-y-3">
            {topics.map((t) => (
              <div key={t.id} className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{t.title}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>{new Date(t.created_at).toLocaleDateString()}{t.difficulty && ` • ${t.difficulty}`}</p>
                  </div>
                  <StatusBadge status={statusMap[t.status] || "pending"} />
                </div>
                {t.ai_summary && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--color-ink-muted)" }}>{t.ai_summary}</p>
                )}
                {/* Action buttons based on status */}
                {t.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleApprove(t.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ backgroundColor: "rgba(76,175,125,0.12)", color: "var(--color-success)" }}>
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button onClick={() => handleRegenerate(t.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ backgroundColor: "rgba(255,193,7,0.12)", color: "var(--color-warning)" }}>
                      <RefreshCcw size={12} /> Regenerate
                    </button>
                    <button onClick={() => handleReject(t.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ backgroundColor: "rgba(224,82,82,0.12)", color: "var(--color-danger)" }}>
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                )}
                {t.status === "processing" && (
                  <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: "var(--color-ink-subtle)" }}>
                    <Clock size={12} className="animate-spin" /> AI processing in progress...
                  </div>
                )}
                {t.status === "approved" && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleRegenerate(t.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "rgba(255,193,7,0.12)", color: "var(--color-warning)" }}>
                      <RefreshCcw size={12} /> Regenerate
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
            <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
            <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No topics uploaded yet</p>
            <p className="text-xs mt-1 mb-4" style={{ color: "var(--color-ink-subtle)" }}>Upload a PDF, PPT or image to generate AI-powered content</p>
            <Button variant="primary" size="sm" onClick={() => setUploadModal(true)}><Upload size={16} /> Upload Material</Button>
          </div>
        )}

        {/* Upload Modal */}
        {uploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="rounded-2xl border p-6 w-full max-w-md" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
              <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Upload Material</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-ink-muted)" }}>Topic Title (optional)</label>
                  <input style={inputStyle} placeholder="Auto-detected from file" value={uploadForm.title} onChange={(e) => setUploadForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-ink-muted)" }}>File (PDF, PPT, Image)</label>
                  <input type="file" accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png,.webp" style={inputStyle} onChange={(e) => setUploadForm(f => ({ ...f, file: e.target.files?.[0] || null }))} />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="ghost" size="sm" onClick={() => setUploadModal(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleUpload} disabled={!uploadForm.file || uploadForm.uploading}>
                  {uploadForm.uploading ? "Uploading..." : "Upload & Process"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>My Classrooms</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Manage classrooms and upload content</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModal((m) => ({ ...m, show: true }))}><Plus size={16} /> Create Classroom</Button>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
      ) : classrooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classrooms.map((c) => (
            <div key={c.id} onClick={() => handleSelectClassroom(c)} className="rounded-2xl border p-6 cursor-pointer hover:-translate-y-1 transition-all duration-200" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <BookOpen size={20} className="mb-3" style={{ color: "var(--color-forest)" }} />
              <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>{c.name}</h3>
              <p className="text-xs mb-3" style={{ color: "var(--color-ink-muted)" }}>{c.subject} • Grade {c.grade}-{c.section}</p>
              <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-ink-subtle)" }}>
                <Users size={12} /> {c.studentCount} students
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No classrooms yet</p>
          <p className="text-xs mt-1 mb-4" style={{ color: "var(--color-ink-subtle)" }}>Create your first classroom to start uploading content</p>
          <Button variant="primary" size="sm" onClick={() => setModal((m) => ({ ...m, show: true }))}><Plus size={16} /> Create Classroom</Button>
        </div>
      )}

      {/* Create Classroom Modal */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl border p-6 w-full max-w-md" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
            <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Create Classroom</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-ink-muted)" }}>Classroom Name *</label>
                <input style={inputStyle} placeholder="e.g. Grade 9 Mathematics" value={modal.name} onChange={(e) => setModal(m => ({ ...m, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-ink-muted)" }}>Grade *</label>
                  <input style={inputStyle} placeholder="e.g. 9" value={modal.grade} onChange={(e) => setModal(m => ({ ...m, grade: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-ink-muted)" }}>Section</label>
                  <input style={inputStyle} placeholder="e.g. A" value={modal.section} onChange={(e) => setModal(m => ({ ...m, section: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-ink-muted)" }}>Subject *</label>
                <input style={inputStyle} placeholder="e.g. Mathematics" value={modal.subject} onChange={(e) => setModal(m => ({ ...m, subject: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="ghost" size="sm" onClick={() => setModal(m => ({ ...m, show: false }))}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleCreateClassroom} disabled={!modal.name || !modal.grade || !modal.subject || modal.saving}>
                {modal.saving ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
