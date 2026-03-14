"use client";

import React, { useState } from "react";
import { OnboardingShell, FloatingInput, FloatingSelect } from "@/components/onboarding/OnboardingShell";
import { useRouter } from "next/navigation";

const subjects = [
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "computer_science", label: "Computer Science" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
];

const gradeLevels = [
  { value: "6", label: "Grade 6" },
  { value: "7", label: "Grade 7" },
  { value: "8", label: "Grade 8" },
  { value: "9", label: "Grade 9" },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "kn", label: "Kannada" },
  { value: "mr", label: "Marathi" },
  { value: "bn", label: "Bengali" },
  { value: "gu", label: "Gujarati" },
];

export default function TeacherOnboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    subject: "",
    gradeLevel: "",
    school: "",
    language: "en",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/onboarding/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.push("/dashboard/teacher");
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingShell
      title="Complete Your Profile"
      subtitle="Set up your teacher account to start creating classrooms."
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
      <FloatingSelect
        id="subject"
        label="Primary Subject"
        value={form.subject}
        options={subjects}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        required
      />
      <FloatingSelect
        id="gradeLevel"
        label="Grade Level"
        value={form.gradeLevel}
        options={gradeLevels}
        onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
        required
      />
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
    </OnboardingShell>
  );
}
