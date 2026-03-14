"use client";

import { useState } from "react";
import { ArrowLeft, Settings2, Save } from "lucide-react";
import { Button } from "@/components/shared";

export default function AdminSettingsPage() {
  const [schoolName, setSchoolName] = useState("PadhAI School");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/admin" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>School Settings</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Configure institution details</p>
        </div>
      </div>

      <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
        <div className="flex items-center gap-2 mb-6">
          <Settings2 size={20} style={{ color: "var(--color-forest)" }} />
          <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>General Settings</h3>
        </div>

        <div className="space-y-5 max-w-lg">
          <div>
            <label className="text-xs font-semibold uppercase mb-1.5 block" style={{ color: "var(--color-ink-subtle)" }}>School Name</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink)" }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase mb-1.5 block" style={{ color: "var(--color-ink-subtle)" }}>Academic Year</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink)" }}
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase mb-1.5 block" style={{ color: "var(--color-ink-subtle)" }}>Supported Languages</label>
            <div className="flex flex-wrap gap-2">
              {["English", "Hindi", "Tamil", "Telugu", "Kannada", "Bengali"].map((lang) => (
                <span key={lang} className="px-3 py-1 rounded-full text-xs font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-ink-muted)" }}>
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Save size={16} />
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
