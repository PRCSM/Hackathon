"use client";

import React, { useState } from "react";
import { OnboardingShell, FloatingInput } from "@/components/onboarding/OnboardingShell";
import { useRouter } from "next/navigation";

export default function ParentOnboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    childEmail: "",
    childRollNumber: "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/onboarding/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.push("/dashboard/parent");
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingShell
      title="Link Your Child"
      subtitle="Enter your details and your child's information to view their progress."
      step={1}
      totalSteps={2}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FloatingInput
        id="name"
        label="Your Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <FloatingInput
        id="phone"
        label="Phone Number"
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <div
        className="border-t pt-5 mt-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p className="text-label mb-4">CHILD INFORMATION</p>
      </div>

      <FloatingInput
        id="childEmail"
        label="Child's Email"
        type="email"
        value={form.childEmail}
        onChange={(e) => setForm({ ...form, childEmail: e.target.value })}
        required
      />
      <p className="text-center text-body-sm" style={{ color: "var(--color-ink-subtle)" }}>or</p>
      <FloatingInput
        id="childRollNumber"
        label="Child's Roll Number"
        value={form.childRollNumber}
        onChange={(e) => setForm({ ...form, childRollNumber: e.target.value })}
      />
    </OnboardingShell>
  );
}
