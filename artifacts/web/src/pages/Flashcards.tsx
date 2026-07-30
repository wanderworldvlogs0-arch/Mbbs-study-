import { useEffect, useState, useCallback } from "react";
import {
  Layers, Play, Clock, Brain, RotateCcw, Trophy, BookOpen,
  Bookmark, ChevronLeft, ChevronRight,
} from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { flashcardsApi } from "../lib/api";
import type { FlashcardSubjectOption, FlashcardSession, FlashcardRating } from "@workspace/api-zod";

export function Flashcards() {
  const [session, setSession] = useState<FlashcardSession | null>(null);

  return (
    <AppLayout pageTitle="Flashcards">
      {session ? (
        <ActiveSession session={session} onExit={() => setSession(null)} />
      ) : (
        <FlashcardHub onStart={setSession} />
      )}
    </AppLayout>
  );
}

function FlashcardHub({ onStart }: { onStart: (s: FlashcardSession) => void }) {
  const [subjects, setSubjects] = useState<FlashcardSubjectOption[] | null>(null);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    flashcardsApi.subjects().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  const totalDue = (subjects ?? []).reduce((a, s) => a + s.dueCount, 0);
  const totalCards = (subjects ?? []).reduce((a, s) => a + s.totalCards, 0);
  const avgMastery = subjects && subjects.length
    ? Math.round(subjects.reduce((a, s) => a + s.masteryPercent, 0) / subjects.length)
    : 0;

  const handleStart = async (subjectId?: string) => {
    setStarting(subjectId ?? "all");
    try {
      const session = await flashcardsApi.session(subjectId);
      if (session.cards.length === 0) {
        alert("No cards due right now for this subject.");
        return;
      }
      onStart(session);
    } finally {
      setStarting(null);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Layers className="w-7 h-7 text-blue-600" /> Flashcards
          </h1>
          <p className="text-slate-500 mt-1.5">Your spaced repetition engine</p>
        </div>
        <button
          onClick={() => handleStart()}
          disabled={starting === "all"}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-semibold shadow-sm flex items-center gap-2 w-fit"
        >
          <Play className="w-5 h-5" /> {starting === "all" ? "Starting…" : "Start Review Session"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Due Today" value={totalDue} icon={Clock} color="text-orange-500" bg="bg-orange-50" />
        <StatCard title="Total Cards" value={totalCards} icon={Brain} color="text-blue-500" bg="bg-blue-50" />
        <StatCard title="Avg Mastery" value={`${avgMastery}%`} icon={Trophy} color="text-green-500" bg="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects === null && <div className="col-span-full text-center text-slate-400 py-12">Loading…</div>}
        {subjects !== null && subjects.length === 0 && (
          <div className="col-span-full text-center text-slate-400 py-12 bg-white border border-dashed border-slate-200 rounded-2xl">
            No flashcards have been added yet.
          </div>
        )}
        {subjects?.map((s) => (
          <div
            key={s.id}
            onClick={() => handleStart(s.id)}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">{s.masteryPercent}%</span>
            </div>
            <h3 className="font-semibold text-slate-900 text-lg mb-1">{s.name}</h3>
            <div className="flex items-center gap-4 text-sm mt-3">
              <div>
                <span className="text-slate-400 text-xs block">Total</span>
                <span className="font-medium text-slate-700">{s.totalCards}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Due</span>
                <span className={`font-semibold ${s.dueCount > 0 ? "text-orange-600" : "text-slate-700"}`}>
                  {s.dueCount > 0 ? `${s.dueCount} cards` : "All caught up!"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string; value: string | number; icon: typeof Clock; color: string; bg: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ActiveSession({ session, onExit }: { session: FlashcardSession; onExit: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (isFinished) return;
    const t = setInterval(() => setTimer((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isFinished]);

  const card = session.cards[index];

  const handleAnswer = useCallback(
    (rating: FlashcardRating) => {
      if (!card) return;
      flashcardsApi.rate(card.id, rating).catch(() => {});
      setReviewed((r) => r + 1);
      if (rating === "good" || rating === "easy") setCorrect((c) => c + 1);
      setIsFlipped(false);
      setTimeout(() => {
        if (index < session.cards.length - 1) setIndex((i) => i + 1);
        else setIsFinished(true);
      }, 150);
    },
    [card, index, session.cards.length],
  );

  const mm = Math.floor(timer / 60).toString().padStart(2, "0");
  const ss = (timer % 60).toString().padStart(2, "0");
  const accuracy = reviewed > 0 ? Math.round((correct / reviewed) * 100) : 0;

  if (isFinished) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 py-16">
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Session Complete!</h2>
          <p className="text-slate-500 mb-8">Great job sticking to your study goals.</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Time</span>
              <span className="text-2xl font-semibold text-slate-900">{mm}:{ss}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Accuracy</span>
              <span className="text-2xl font-semibold text-green-500">{accuracy}%</span>
            </div>
          </div>
          <button
            onClick={onExit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-sm"
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{session.subjectName}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900">{index + 1} / {session.cards.length}</span>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${((index + 1) / session.cards.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
        <button onClick={onExit} className="text-sm font-medium text-slate-500 hover:text-slate-800">Exit</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div
          onClick={() => setIsFlipped((f) => !f)}
          className="w-full max-w-2xl min-h-[280px] bg-white rounded-3xl border border-slate-200 shadow-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer"
        >
          {!isFlipped ? (
            <p className="text-xl md:text-2xl font-semibold text-slate-900 leading-relaxed">{card.front}</p>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-xl md:text-2xl font-bold text-blue-700 leading-relaxed">{card.back}</p>
              {card.mnemonic && (
                <p className="text-sm text-slate-500 italic">💡 {card.mnemonic}</p>
              )}
              {card.reference && (
                <p className="text-xs text-slate-400">{card.reference}</p>
              )}
            </div>
          )}
          {!isFlipped && <p className="text-xs text-slate-400 mt-6">Tap to reveal answer</p>}
        </div>

        {!isFlipped ? (
          <button
            onClick={() => setIsFlipped(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold"
          >
            Show Answer
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
            <button onClick={() => handleAnswer("again")} className="bg-rose-100 hover:bg-rose-200 text-rose-700 py-3 rounded-xl font-bold">Again</button>
            <button onClick={() => handleAnswer("hard")} className="bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 rounded-xl font-bold">Hard</button>
            <button onClick={() => handleAnswer("good")} className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 rounded-xl font-bold">Good</button>
            <button onClick={() => handleAnswer("easy")} className="bg-green-100 hover:bg-green-200 text-green-700 py-3 rounded-xl font-bold">Easy</button>
          </div>
        )}
      </div>
    </div>
  );
}
