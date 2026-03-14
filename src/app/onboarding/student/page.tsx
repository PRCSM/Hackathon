"use client";

import React, { useState } from "react";
import { OnboardingShell, FloatingInput, FloatingSelect } from "@/components/onboarding/OnboardingShell";
import { useRouter } from "next/navigation";

const classes = [
  { value: "6", label: "Class 6" },
  { value: "7", label: "Class 7" },
  { value: "8", label: "Class 8" },
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
  { value: "11", label: "Class 11" },
  { value: "12", label: "Class 12" },
];

const sections = [
  { value: "A", label: "Section A" },
  { value: "B", label: "Section B" },
  { value: "C", label: "Section C" },
  { value: "D", label: "Section D" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "kn", label: "Kannada" },
  { value: "mr", label: "Marathi" },
];

export default function StudentOnboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    class: "",
    section: "",
    school: "",
    language: "en",
    consent: false,
  });

  const handleSubmit = async () => {
    if (!form.consent) {
      alert("Please provide consent to continue.");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch("/api/onboarding/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.push("/dashboard/student");
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingShell
      title="Welcome, Student!"
      subtitle="Fill in your details to start learning."
      step={1}
      totalSteps={2}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FloatingInput
        id="name"
        label="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <FloatingInput
        id="rollNumber"
        label="Roll Number"
        value={form.rollNumber}
        onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <FloatingSelect
          id="class"
          label="Class"
          value={form.class}
          options={classes}
          onChange={(e) => setForm({ ...form, class: e.target.value })}
          required
        />
        <FloatingSelect
          id="section"
          label="Section"
          value={form.section}
          options={sections}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          required
        />
      </div>
      <FloatingInput
        id="school"
        label="School Name"
        value={form.school}
        onChange={(e) => setForm({ ...form, school: e.target.value })}
        required
      />
      <FloatingSelect
        id="language"
        label="Preferred Language"
        value={form.language}
        options={languages}
        onChange={(e) => setForm({ ...form, language: e.target.value })}
      />
      {/* Consent checkbox */}
      <label className="flex items-start gap-3 cursor-pointer mt-2">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          className="mt-1 w-4 h-4 rounded"
          style={{ accentColor: "var(--color-forest)" }}
        />
        <span className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
          I consent to the collection and use of my learning data for educational
          analytics and personalized content recommendations.
        </span>
      </label>
    </OnboardingShell>
  );
}
