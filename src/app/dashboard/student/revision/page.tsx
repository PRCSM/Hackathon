"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCcw } from "lucide-react";

interface Flashcard {
  id: string;
  front_text: string;
  back_text: string;
}

interface FlashcardSet {
  id: string;
  title: string;
  topic_title: string;
  flashcards: Flashcard[];
}

export default function StudentRevisionPage() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSet, setActiveSet] = useState<FlashcardSet | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    fetch("/api/student/revision")
      .then((r) => r.ok ? r.json() : { sets: [] })
      .then((data) => { setSets(data.sets || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const startRevision = (set: FlashcardSet) => { setActiveSet(set); setCardIndex(0); setFlipped(false); };
  const nextCard = () => { setCardIndex((i) => Math.min(i + 1, (activeSet?.flashcards.length || 1) - 1)); setFlipped(false); };
  const prevCard = () => { setCardIndex((i) => Math.max(i - 1, 0)); setFlipped(false); };

  if (activeSet) {
    const card = activeSet.flashcards[cardIndex];
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setActiveSet(null)} className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
            <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
          </button>
          <div>
            <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>{activeSet.title}</h1>
            <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Card {cardIndex + 1} of {activeSet.flashcards.length}</p>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => setFlipped((f) => !f)}
            className="w-full max-w-lg rounded-3xl border p-10 text-center cursor-pointer transition-all duration-300 select-none"
            style={{ backgroundColor: flipped ? "var(--color-forest)" : "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)", minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
          >
            <p className="text-xs font-bold mb-4 uppercase tracking-wider" style={{ color: flipped ? "rgba(255,255,255,0.6)" : "var(--color-ink-subtle)" }}>
              {flipped ? "Answer" : "Question — Tap to reveal"}
            </p>
            <p className="text-lg font-semibold" style={{ color: flipped ? "white" : "var(--color-ink)", lineHeight: 1.5 }}>
              {flipped ? card.back_text : card.front_text}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-6">
            <button onClick={prevCard} disabled={cardIndex === 0}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-40"
              style={{ backgroundColor: "var(--color-card)", color: "var(--color-ink)", border: "1px solid var(--color-border)" }}>
              ← Prev
            </button>
            <span className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{cardIndex + 1}/{activeSet.flashcards.length}</span>
            <button onClick={nextCard} disabled={cardIndex === activeSet.flashcards.length - 1}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-40"
              style={{ backgroundColor: "var(--color-forest)", color: "white" }}>
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/student" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Revision Mode</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>AI-powered flashcards for exam prep</p>
        </div>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
      ) : sets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map((s) => (
            <div key={s.id} onClick={() => startRevision(s)}
              className="rounded-2xl border p-5 cursor-pointer hover:-translate-y-1 transition-all duration-200"
              style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <RefreshCcw size={18} className="mb-3" style={{ color: "var(--color-forest)" }} />
              <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>{s.title}</h3>
              <p className="text-xs mb-2" style={{ color: "var(--color-ink-subtle)" }}>{s.topic_title}</p>
              <p className="text-xs font-medium" style={{ color: "var(--color-forest)" }}>{s.flashcards.length} cards</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <RefreshCcw size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No flashcards yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Flashcards are generated when your teacher uploads and approves content</p>
        </div>
      )}
    </div>
  );
}
