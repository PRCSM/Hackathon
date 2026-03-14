"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/shared";
import { ArrowLeft, Users } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  role: string;
  onboarding_completed: boolean;
  created_at: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(() => {
        // Fetch students from users where role=student
        fetch("/api/admin/students")
          .then((r) => r.ok ? r.json() : { students: [] })
          .then((data) => { setStudents(data.students || []); setLoading(false); })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/admin" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Student Management</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>View and manage enrolled students</p>
        </div>
      </div>

      <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} style={{ color: "var(--color-forest)" }} />
          <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>All Students ({students.length})</h3>
        </div>
        {loading ? (
          <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "var(--color-border)", color: "var(--color-ink-subtle)" }}>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b last:border-b-0 hover:bg-[var(--color-card-hover)] transition-colors" style={{ borderColor: "var(--color-border)" }}>
                    <td className="py-3.5 pr-4"><span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{s.name || "—"}</span></td>
                    <td className="py-3.5 pr-4"><span className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>{s.email}</span></td>
                    <td className="py-3.5 pr-4"><StatusBadge status={s.onboarding_completed ? "active" : "pending"} /></td>
                    <td className="py-3.5 pr-4"><span className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{new Date(s.created_at).toLocaleDateString()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>No students have registered yet.</p>
        )}
      </div>
    </div>
  );
}
