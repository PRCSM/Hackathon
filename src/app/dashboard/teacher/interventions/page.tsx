"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, PenTool, AlertTriangle, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/shared";

interface ClassroomStudent {
  id: string;
  name: string | null;
  email: string;
  roll_number: string | null;
}

interface InterventionNote {
  id: string;
  note: string;
  visible_to_parent: boolean;
  created_at: string;
  teacher_name: string | null;
}

interface Classroom {
  id: string;
  name: string;
  grade: string;
  section: string;
}

export default function TeacherInterventionsPage() {
  const { data: session } = useSession();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [students, setStudents] = useState<ClassroomStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<ClassroomStudent | null>(null);
  const [notes, setNotes] = useState<InterventionNote[]>([]);
  const [addForm, setAddForm] = useState({ note: "", visibleToParent: false, saving: false, show: false });

  useEffect(() => {
    const teacherId = (session?.user as { id?: string })?.id;
    if (!teacherId) return;
    fetch(`/api/classrooms?teacherId=${teacherId}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setClassrooms(list);
        if (list.length > 0) setSelectedClassroomId(list[0].id);
      });
  }, [session]);

  useEffect(() => {
    if (!selectedClassroomId) return;
    fetch(`/api/classrooms/${selectedClassroomId}/students`)
      .then((r) => r.ok ? r.json() : { students: [] })
      .then((data) => setStudents(data.students || []));
  }, [selectedClassroomId]);

  const fetchNotes = (studentId: string) => {
    fetch(`/api/interventions?studentId=${studentId}`)
      .then((r) => r.ok ? r.json() : { notes: [] })
      .then((data) => setNotes(data.notes || []));
  };

  const handleSelectStudent = (s: ClassroomStudent) => {
    setSelectedStudent(s);
    fetchNotes(s.id);
  };

  const handleAddNote = async () => {
    if (!selectedStudent || !addForm.note.trim()) return;
    setAddForm((f) => ({ ...f, saving: true }));
    await fetch("/api/interventions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: selectedStudent.id,
        note: addForm.note,
        visibleToParent: addForm.visibleToParent,
      }),
    });
    setAddForm({ note: "", visibleToParent: false, saving: false, show: false });
    fetchNotes(selectedStudent.id);
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: "10px",
    border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg)",
    color: "var(--color-ink)", fontSize: "14px", outline: "none",
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/teacher" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Interventions</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Add notes for students who need extra support</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Student list */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <div className="mb-3">
            {classrooms.length > 1 && (
              <select value={selectedClassroomId} onChange={(e) => setSelectedClassroomId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs mb-3"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)", color: "var(--color-ink)" }}>
                {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <p className="text-xs font-semibold" style={{ color: "var(--color-ink-muted)" }}>STUDENTS</p>
          </div>
          {students.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>No students in this classroom yet</p>
          ) : (
            <div className="space-y-1">
              {students.map((s) => (
                <button key={s.id} onClick={() => handleSelectStudent(s)}
                  className="w-full text-left p-3 rounded-xl transition-colors text-sm"
                  style={{ backgroundColor: selectedStudent?.id === s.id ? "rgba(74,122,89,0.08)" : "transparent", color: "var(--color-ink)", borderLeft: selectedStudent?.id === s.id ? "3px solid var(--color-forest)" : "3px solid transparent" }}>
                  <p className="font-medium">{s.name || s.email}</p>
                  {s.roll_number && <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>Roll: {s.roll_number}</p>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes panel */}
        <div className="lg:col-span-2">
          {!selectedStudent ? (
            <div className="rounded-2xl border p-12 text-center h-full flex flex-col items-center justify-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
              <PenTool size={40} className="mb-3" style={{ color: "var(--color-ink-subtle)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Select a student</p>
              <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Choose a student from the left to view or add intervention notes</p>
            </div>
          ) : (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{selectedStudent.name || selectedStudent.email}</h3>
                  <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => setAddForm(f => ({ ...f, show: !f.show }))}>
                  <Plus size={14} /> Add Note
                </Button>
              </div>

              {addForm.show && (
                <div className="rounded-xl border p-4 mb-4" style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}>
                  <textarea
                    rows={3}
                    placeholder="Write your intervention note..."
                    value={addForm.note}
                    onChange={(e) => setAddForm(f => ({ ...f, note: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <label className="flex items-center gap-2 text-xs" style={{ color: "var(--color-ink-muted)" }}>
                      <input type="checkbox" checked={addForm.visibleToParent} onChange={(e) => setAddForm(f => ({ ...f, visibleToParent: e.target.checked }))} />
                      Share with parent
                    </label>
                    <Button variant="primary" size="sm" onClick={handleAddNote} disabled={!addForm.note.trim() || addForm.saving}>
                      {addForm.saving ? "Saving..." : "Save Note"}
                    </Button>
                  </div>
                </div>
              )}

              {notes.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: "var(--color-ink-subtle)" }}>No notes yet for this student</p>
              ) : (
                <div className="space-y-3">
                  {notes.map((n) => (
                    <div key={n.id} className="p-4 rounded-xl" style={{ backgroundColor: "var(--color-bg)", borderLeft: "3px solid var(--color-sage)" }}>
                      <p className="text-sm" style={{ color: "var(--color-ink)" }}>{n.note}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{new Date(n.created_at).toLocaleDateString()}</p>
                        {n.visible_to_parent && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(74,122,89,0.1)", color: "var(--color-forest)" }}>Shared with parent</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
