import { useEffect, useState } from "react";
import {
  Play, Clock, Trophy, Search, XCircle, SkipForward, ChevronLeft,
  ChevronRight, CheckCircle2, Eye, RotateCcw,
} from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { quizApi } from "../lib/api";
import type {
  QuizSubjectOption, QuizAttemptStart, QuizResult,
  RecentQuizSummary, LeaderboardEntry,
} from "@workspace/api-zod";

type ViewState = "hub" | "active" | "results";

export function Quiz() {
  const [view, setView] = useState<ViewState>("hub");
  const [attempt, setAttempt] = useState<QuizAttemptStart | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  return (
    <AppLayout pageTitle="Quiz">
      {view === "hub" && (
        <QuizHub
          onStart={(a) => {
            setAttempt(a);
            setView("active");
          }}
        />
      )}
      {view === "active" && attempt && (
        <ActiveQuiz
          attempt={attempt}
          onSubmit={(r) => {
            setResult(r);
            setView("results");
          }}
          onQuit={() => setView("hub")}
        />
      )}
      {view === "results" && result && (
        <QuizResultsView result={result} onBack={() => setView("hub")} />
      )}
    </AppLayout>
  );
}

function QuizHub({ onStart }: { onStart: (attempt: QuizAttemptStart) => void }) {
  const [subjects, setSubjects] = useState<QuizSubjectOption[] | null>(null);
  const [recent, setRecent] = useState<RecentQuizSummary[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [search, setSearch] = useState("");
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    quizApi.subjects().then(setSubjects).catch(() => setSubjects([]));
    quizApi.recent().then(setRecent).catch(() => setRecent([]));
    quizApi.leaderboard().then(setLeaderboard).catch(() => setLeaderboard([]));
  }, []);

  const filtered = (subjects ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleStart = async (subjectId: string) => {
    setStarting(subjectId);
    try {
      const attempt = await quizApi.start(subjectId);
      onStart(attempt);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not start quiz");
    } finally {
      setStarting(null);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Quiz Zone</h1>
        <p className="text-slate-500 mt-1.5 text-sm md:text-base">Test your knowledge, track your growth</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">Subject-wise Quizzes</h2>
              <div className="relative w-56">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto">
              {subjects === null && <div className="text-slate-400 text-sm py-8 text-center col-span-2">Loading…</div>}
              {subjects !== null && filtered.length === 0 && (
                <div className="text-slate-400 text-sm py-8 text-center col-span-2">No subjects found.</div>
              )}
              {filtered.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                >
                  <div>
                    <span className="font-medium text-slate-800">{sub.name}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{sub.mcqCount} questions available</p>
                  </div>
                  <button
                    onClick={() => handleStart(sub.id)}
                    disabled={sub.mcqCount === 0 || starting === sub.id}
                    className="bg-blue-600 disabled:bg-slate-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1 flex-shrink-0 ml-3"
                  >
                    {starting === sub.id ? "Starting…" : <>Start <Play className="w-3 h-3" /></>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Recent Quizzes</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recent.length === 0 && (
                <div className="p-5 text-sm text-slate-400 text-center">No quizzes taken yet.</div>
              )}
              {recent.map((q) => (
                <div key={q.attemptId} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">{q.subjectName}</h4>
                    <p className="text-xs text-slate-500">{new Date(q.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span className="text-sm font-bold text-slate-700">{q.correctCount}/{q.totalQuestions}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {q.accuracyPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-slate-900">Leaderboard</h2>
            </div>
            <div className="p-3">
              {leaderboard.length === 0 && (
                <div className="p-4 text-sm text-slate-400 text-center">No scores yet.</div>
              )}
              {leaderboard.map((lb) => (
                <div key={lb.userId} className={`flex items-center p-3 rounded-xl mb-1 ${lb.isUser ? "bg-blue-50 border border-blue-100" : ""}`}>
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold mr-3">
                    {lb.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {lb.name} {lb.isUser && <span className="text-xs font-normal text-blue-600 ml-1">(You)</span>}
                    </p>
                  </div>
                  <div className="font-bold text-blue-600 text-sm">{lb.totalCorrect}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveQuiz({
  attempt,
  onSubmit,
  onQuit,
}: {
  attempt: QuizAttemptStart;
  onSubmit: (result: QuizResult) => void;
  onQuit: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [elapsedSec, setElapsedSec] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const question = attempt.questions[current]!;
  const answeredCount = Object.values(answers).filter((v) => v != null).length;
  const skippedCount = Object.values(answers).filter((v) => v === null).length;

  const selectOption = (optionId: string) => {
    setAnswers((a) => ({ ...a, [question.mcqId]: optionId }));
    quizApi.saveAnswer(attempt.attemptId, question.mcqId, optionId).catch(() => {});
  };

  const skip = () => {
    setAnswers((a) => ({ ...a, [question.mcqId]: null }));
    quizApi.saveAnswer(attempt.attemptId, question.mcqId, null).catch(() => {});
    if (current < attempt.questions.length - 1) setCurrent(current + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await quizApi.submit(attempt.attemptId);
      onSubmit(result);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not submit quiz");
      setSubmitting(false);
    }
  };

  const mm = Math.floor(elapsedSec / 60).toString().padStart(2, "0");
  const ss = (elapsedSec % 60).toString().padStart(2, "0");

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onQuit} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
            <XCircle className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900">{attempt.subjectName}</h2>
            <p className="text-xs text-slate-500 font-medium">Question {current + 1} of {attempt.questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-mono font-bold">
            <Clock className="w-4 h-4" /> {mm}:{ss}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm"
          >
            {submitting ? "Submitting…" : "Submit Quiz"}
          </button>
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-200 shrink-0">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${((current + 1) / attempt.questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="max-w-3xl w-full flex flex-col gap-8 pb-20">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                {current + 1}
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 leading-relaxed">{question.questionText}</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
              {question.options.map((opt) => {
                const selected = answers[question.mcqId] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => selectOption(opt.id)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all group relative overflow-hidden ${
                      selected ? "border-blue-600 bg-blue-50 shadow-md" : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    {selected && <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-600" />}
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                        {opt.id}
                      </div>
                      <span className={`text-lg font-medium ${selected ? "text-blue-900" : "text-slate-700"}`}>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-4">
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex items-center gap-3">
                <button onClick={skip} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-500 hover:bg-slate-200">
                  Skip <SkipForward className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrent((c) => Math.min(attempt.questions.length - 1, c + 1))}
                  disabled={current === attempt.questions.length - 1}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold disabled:opacity-40"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-72 bg-white border-l border-slate-200 p-6 flex flex-col shrink-0">
          <h3 className="font-bold text-slate-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-2 mb-8">
            {attempt.questions.map((q, i) => {
              const ans = answers[q.mcqId];
              const isCurrent = i === current;
              let cls = "bg-slate-100 text-slate-500 hover:bg-slate-200";
              if (isCurrent) cls = "ring-2 ring-blue-600 bg-blue-100 text-blue-700";
              else if (ans != null) cls = "bg-blue-600 text-white";
              else if (ans === null && q.mcqId in answers) cls = "bg-amber-100 text-amber-700";
              return (
                <button key={q.mcqId} onClick={() => setCurrent(i)} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${cls}`}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-auto space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-blue-600" /> Answered ({answeredCount})</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-amber-100" /> Skipped ({skippedCount})</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-slate-100" /> Unseen ({attempt.questions.length - answeredCount - skippedCount})</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizResultsView({ result, onBack }: { result: QuizResult; onBack: () => void }) {
  const [showReview, setShowReview] = useState(false);
  const incorrectCount = result.answers.filter((a) => a.selectedOptionId != null && !a.isCorrect).length;
  const skippedCount = result.answers.filter((a) => a.selectedOptionId == null).length;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (result.accuracyPercent / 100) * circumference;

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Quiz Results</h1>
          <p className="text-slate-500 mt-1">{result.subjectName}</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl">
          Back to Hub
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className={`absolute top-0 inset-x-0 h-2 ${result.passed ? "bg-green-500" : "bg-rose-500"}`} />
          <h2 className={`font-bold text-xl mb-6 ${result.passed ? "text-green-600" : "text-rose-600"}`}>
            {result.passed ? "Good Performance!" : "Needs Review"}
          </h2>
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle
                cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                className={result.passed ? "text-green-500" : "text-rose-500"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">
                {result.accuracyPercent}<span className="text-2xl text-slate-400">%</span>
              </span>
              <span className="text-sm font-bold text-slate-500 mt-1">{result.correctCount} / {result.totalQuestions}</span>
            </div>
          </div>
          <button
            onClick={() => setShowReview((v) => !v)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" /> {showReview ? "Hide Review" : "Review Answers"}
          </button>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-3xl font-black text-slate-900 mb-1">{result.correctCount}</div>
            <div className="text-sm font-medium text-slate-500">Correct</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <XCircle className="w-8 h-8 text-rose-500 mb-3" />
            <div className="text-3xl font-black text-slate-900 mb-1">{incorrectCount}</div>
            <div className="text-sm font-medium text-slate-500">Incorrect</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <SkipForward className="w-8 h-8 text-amber-500 mb-3" />
            <div className="text-3xl font-black text-slate-900 mb-1">{skippedCount}</div>
            <div className="text-sm font-medium text-slate-500">Skipped</div>
          </div>
        </div>
      </div>

      {showReview && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800">Answer Review</h2>
          {result.answers.map((a, idx) => (
            <div key={a.mcqId} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${a.isCorrect ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"}`}>
                  {idx + 1}
                </div>
                <p className="font-semibold text-slate-800">{a.questionText}</p>
              </div>
              <div className="flex flex-col gap-2 ml-10">
                {a.options.map((opt) => {
                  const isCorrectOpt = opt.id === a.correctOptionId;
                  const isSelected = opt.id === a.selectedOptionId;
                  return (
                    <div
                      key={opt.id}
                      className={`px-4 py-2 rounded-lg text-sm border ${
                        isCorrectOpt ? "bg-green-50 border-green-200 text-green-800 font-semibold"
                          : isSelected ? "bg-rose-50 border-rose-200 text-rose-800"
                          : "border-slate-100 text-slate-600"
                      }`}
                    >
                      {opt.id}. {opt.text}
                    </div>
                  );
                })}
              </div>
              {a.explanation && (
                <p className="text-xs text-slate-500 mt-3 ml-10">{a.explanation}</p>
              )}
            </div>
          ))}
          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 mt-2"
          >
            <RotateCcw className="w-4 h-4" /> Back to Quiz Hub
          </button>
        </div>
      )}
    </div>
  );
}
