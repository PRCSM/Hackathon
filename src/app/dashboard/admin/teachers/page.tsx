"use client";

import { useEffect, useState } from "react";
import { StatusBadge, Button } from "@/components/shared";
import { ArrowLeft, UserPlus, MoreVertical, Check, X } from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject?: string;
  grade_level?: string;
  school_name?: string;
  onboarding_completed?: boolean;
  created_at?: string;
}

interface PendingRequest {
  id: number;
  email: string;
  name: string;
  status: string;
  created_at: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchTeachers = () => {
    fetch("/api/admin/teachers")
      .then((r) => r.json())
      .then((data) => {
        setTeachers(data.teachers || []);
        setPendingRequests(data.pendingRequests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleAction = async (action: string, email: string, requestId?: number) => {
    await fetch("/api/admin/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, email, requestId }),
    });
    fetchTeachers();
  };

  const handleAddTeacher = async () => {
    if (!newEmail) return;
    await handleAction("add", newEmail);
    setNewEmail("");
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <a href="/dashboard/admin" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
            <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
          </a>
          <div>
            <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Teacher Management</h1>
            <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
              Approve, add, or remove teachers
            </p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={16} /> Add Teacher
        </Button>
      </div>

      {/* Add Teacher Form */}
      {showAddForm && (
        <div className="rounded-2xl border p-4 mb-6 flex gap-3 items-end" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase mb-1 block" style={{ color: "var(--color-ink-subtle)" }}>Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="teacher@school.edu"
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink)" }}
            />
          </div>
          <Button variant="primary" size="sm" onClick={handleAddTeacher}>Approve Email</Button>
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Pending Requests ({pendingRequests.length})</h3>
          <div className="space-y-2">
            {pendingRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{r.email}</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>Requested {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction("approve", r.email, r.id)} className="p-2 rounded-lg hover:bg-green-500/10 transition-colors" title="Approve">
                    <Check size={16} style={{ color: "var(--color-success)" }} />
                  </button>
                  <button onClick={() => handleAction("reject", r.email, r.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Reject">
                    <X size={16} style={{ color: "var(--color-danger)" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Teachers */}
      <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
        <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Active Teachers ({teachers.length})</h3>
        {loading ? (
          <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
        ) : teachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "var(--color-border)", color: "var(--color-ink-subtle)" }}>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Subject</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="border-b last:border-b-0 transition-colors hover:bg-[var(--color-card-hover)]" style={{ borderColor: "var(--color-border)" }}>
                    <td className="py-3.5 pr-4">
                      <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{t.name || "—"}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>{t.email}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>{t.subject || "Not set"}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <StatusBadge status={t.onboarding_completed ? "active" : "pending"} />
                    </td>
                    <td className="py-3.5">
                      <button onClick={() => handleAction("remove", t.email)} className="p-1.5 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors" title="Remove">
                        <X size={16} style={{ color: "var(--color-danger)" }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>No teachers registered yet.</p>
        )}
      </div>
    </div>
  );
}
