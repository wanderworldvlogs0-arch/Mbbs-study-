import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { BookOpen, Brain, PlayCircle, Clock, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { dashboardApi, subjectsApi } from "../lib/api";
import type { DashboardSummary, SubjectSummary } from "@workspace/api-zod";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function formatHms(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function formatHoursMinutes(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const pendingSecondsRef = useRef(0);

  const loadSummary = () => dashboardApi.summary().then(setSummary);

  useEffect(() => {
    loadSummary();
    subjectsApi.list().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  // Live study timer: ticks locally every second, flushes accumulated
  // seconds to the server every 30s (and on unmount) so it survives reloads.
  useEffect(() => {
    const tick = setInterval(() => {
      setLiveSeconds((s) => s + 1);
      pendingSecondsRef.current += 1;
    }, 1000);

    const flush = setInterval(() => {
      const pending = pendingSecondsRef.current;
      if (pending > 0) {
        pendingSecondsRef.current = 0;
        dashboardApi.addStudyTime(pending).then(setSummary);
      }
    }, 30_000);

    const flushOnLeave = () => {
      const pending = pendingSecondsRef.current;
      if (pending > 0) {
        pendingSecondsRef.current = 0;
        navigator.sendBeacon?.(
          "/api/dashboard/study-time",
          new Blob([JSON.stringify({ seconds: pending })], { type: "application/json" }),
        );
      }
    };
    window.addEventListener("beforeunload", flushOnLeave);

    return () => {
      clearInterval(tick);
      clearInterval(flush);
      window.removeEventListener("beforeunload", flushOnLeave);
      flushOnLeave();
    };
  }, []);

  const handleIncrementGoal = async (type: "chapters" | "mcqs" | "videos") => {
    const updated = await dashboardApi.incrementGoal(type);
    setSummary(updated);
  };

  if (!summary) {
    return (
      <AppLayout pageTitle="Dashboard">
        <div className="p-8 text-center text-slate-400">Loading…</div>
      </AppLayout>
    );
  }

  const todayDisplaySeconds = summary.todayStudySeconds + liveSeconds;
  const totalGoals = summary.goals.chapters.target + summary.goals.mcqs.target + summary.goals.videos.target;
  const totalCompleted = summary.goals.chapters.current + summary.goals.mcqs.current + summary.goals.videos.current;
  const goalsPercent = totalGoals === 0 ? 0 : Math.round((totalCompleted / totalGoals) * 100);

  const topSubjects = [...subjects].sort((a, b) => b.progressPercent - a.progressPercent).slice(0, 6);

  return (
    <AppLayout pageTitle="Dashboard">
      <div className="max-w-7xl mx-auto p-5 md:p-8 space-y-8">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
        </div>

        {/* Quick stats — only ones backed by real data */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <StatCard
            icon={Clock}
            label="Study Time Today"
            value={
              <div className="flex items-center gap-2">
                {formatHms(todayDisplaySeconds)}
                <span className="relative flex h-3 w-3 mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            }
            color="blue"
          />
          <StatCard icon={Calendar} label="This Week" value={formatHoursMinutes(summary.weekStudySeconds)} color="indigo" />
          <StatCard icon={CheckCircle2} label="All-Time Study Time" value={formatHoursMinutes(summary.totalStudySeconds)} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Today's Goals */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 relative overflow-hidden">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Today's Goals</h3>
                    <p className="text-sm text-slate-500 mt-1">Keep the streak going.</p>
                  </div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-4 border-slate-100 relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-blue-500 transition-all duration-1000 ease-out"
                        strokeDasharray={`${goalsPercent}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-sm font-bold text-slate-900">{goalsPercent}%</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <GoalRow label="Read Chapters" current={summary.goals.chapters.current} target={summary.goals.chapters.target} icon={BookOpen} color="blue" onIncrement={() => handleIncrementGoal("chapters")} />
                  <GoalRow label="Solve MCQs" current={summary.goals.mcqs.current} target={summary.goals.mcqs.target} icon={Brain} color="purple" onIncrement={() => handleIncrementGoal("mcqs")} />
                  <GoalRow label="Watch Videos" current={summary.goals.videos.current} target={summary.goals.videos.target} icon={PlayCircle} color="pink" onIncrement={() => handleIncrementGoal("videos")} />
                </div>
              </div>

              {/* Subject Mastery */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900">Subject Mastery</h3>
                  <SubjectsLink />
                </div>

                <div className="space-y-5">
                  {topSubjects.length === 0 && <p className="text-sm text-slate-400">No subjects yet.</p>}
                  {topSubjects.map((s) => (
                    <div key={s.id}>
                      <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1.5">
                        <span>{s.name}</span>
                        <span>{s.progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.progressPercent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column: streak */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-7 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-orange-50 uppercase tracking-widest text-[10px]">Study Streak</span>
                </div>
                <div className="text-5xl font-black mb-2 tracking-tight">
                  {countStreak(summary.streakDays)} <span className="text-2xl text-orange-200 font-bold">Days</span>
                </div>
                <p className="text-orange-50 text-sm font-medium mb-5 leading-relaxed">
                  Complete a goal today to keep your streak going.
                </p>

                <div className="flex justify-between items-center mt-2 bg-black/15 rounded-xl p-3.5 backdrop-blur-sm border border-white/10">
                  {WEEKDAY_LABELS.map((day, i) => {
                    const isCompleted = summary.streakDays[i];
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-orange-200">{day}</span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-inner transition-all duration-300
                            ${isCompleted ? "bg-white text-orange-600" : "bg-white/10 text-white border border-white/20"}
                          `}
                        >
                          {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function countStreak(streakDays: boolean[]): number {
  let count = 0;
  for (let i = streakDays.length - 1; i >= 0; i--) {
    if (!streakDays[i]) break;
    count++;
  }
  return count;
}

function SubjectsLink() {
  const [, navigate] = useLocation();
  return (
    <button onClick={() => navigate("/subjects")} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
      View All <ChevronRight className="w-4 h-4 ml-0.5" />
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Clock;
  label: string;
  value: React.ReactNode;
  color: "blue" | "indigo" | "green";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-0.5">{label}</p>
        <div className="text-lg font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function GoalRow({
  label,
  current,
  target,
  icon: Icon,
  color,
  onIncrement,
}: {
  label: string;
  current: number;
  target: number;
  icon: typeof BookOpen;
  color: "blue" | "purple" | "pink";
  onIncrement: () => void;
}) {
  const percent = target === 0 ? 0 : Math.min(100, Math.round((current / target) * 100));
  const done = current >= target;
  const colors = {
    blue: "bg-blue-500 text-blue-600 bg-blue-50",
    purple: "bg-purple-500 text-purple-600 bg-purple-50",
    pink: "bg-pink-500 text-pink-600 bg-pink-50",
  };
  const [bar, , chip] = colors[color].split(" ");

  return (
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${chip}`}>
        <Icon className={`w-5 h-5 ${colors[color].split(" ")[1]}`} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1.5">
          <span>{label}</span>
          <span>{current}/{target}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${bar}`} style={{ width: `${percent}%` }} />
        </div>
      </div>
      <button
        onClick={onIncrement}
        disabled={done}
        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex-shrink-0 text-lg font-bold"
        title={done ? "Goal complete" : "Log one"}
      >
        +
      </button>
    </div>
  );
}
