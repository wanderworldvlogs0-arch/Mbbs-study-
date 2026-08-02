import { useEffect, useState } from "react";
import { TrendingUp, BookOpen, Flame, Target, Clock } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { subjectsApi, dashboardApi, quizApi } from "../lib/api";
import type { SubjectSummary, DashboardSummary, RecentQuizSummary } from "@workspace/api-zod";

function currentStreak(days: boolean[]): number {
  let count = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (!days[i]) break;
    count++;
  }
  return count;
}

export function Progress() {
  const [subjects, setSubjects] = useState<SubjectSummary[] | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuizSummary[]>([]);

  useEffect(() => {
    subjectsApi.list().then(setSubjects).catch(() => setSubjects([]));
    dashboardApi.summary().then(setDashboard).catch(() => setDashboard(null));
    quizApi.recent().then(setRecentQuizzes).catch(() => setRecentQuizzes([]));
  }, []);

  const overallCompletion = subjects && subjects.length
    ? Math.round(subjects.reduce((a, s) => a + s.progressPercent, 0) / subjects.length)
    : 0;
  const streak = dashboard ? currentStreak(dashboard.streakDays) : 0;
  const weekHours = dashboard ? (dashboard.weekStudySeconds / 3600).toFixed(1) : "0";
  const avgAccuracy = recentQuizzes.length
    ? Math.round(recentQuizzes.reduce((a, q) => a + q.accuracyPercent, 0) / recentQuizzes.length)
    : null;

  const sortedSubjects = [...(subjects ?? [])].sort((a, b) => b.progressPercent - a.progressPercent);

  return (
    <AppLayout pageTitle="Progress">
      <div className="p-5 md:p-8 max-w-6xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" /> Progress
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5">Track how far you've come</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Overall Completion" value={`${overallCompletion}%`} icon={BookOpen} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/30" />
          <StatCard title="Current Streak" value={`${streak} days`} icon={Flame} color="text-orange-500" bg="bg-orange-50 dark:bg-orange-900/30" />
          <StatCard title="This Week" value={`${weekHours}h`} icon={Clock} color="text-purple-500" bg="bg-purple-50 dark:bg-purple-900/30" />
          <StatCard title="Quiz Accuracy" value={avgAccuracy !== null ? `${avgAccuracy}%` : "—"} icon={Target} color="text-green-500" bg="bg-green-50 dark:bg-green-900/30" />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5">Subject-wise Progress</h2>
          {subjects === null && <div className="text-slate-400 dark:text-slate-500 text-center py-8">Loading…</div>}
          <div className="flex flex-col gap-4">
            {sortedSubjects.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">{s.name}</span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">{s.progressPercent}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.progressPercent === 100 ? "bg-green-500" : "bg-blue-500"}`}
                    style={{ width: `${s.progressPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5">Recent Quiz Performance</h2>
          {recentQuizzes.length === 0 && (
            <p className="text-slate-400 dark:text-slate-500 text-center py-8">No quizzes taken yet.</p>
          )}
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
            {recentQuizzes.map((q) => (
              <div key={q.attemptId} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{q.subjectName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(q.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{q.correctCount}/{q.totalQuestions}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.passed ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"}`}>
                    {q.accuracyPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {dashboard && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5">This Week's Activity</h2>
            <div className="flex justify-between gap-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((label, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className={`w-full aspect-square rounded-xl flex items-center justify-center ${
                    dashboard.streakDays[i] ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" : "bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600"
                  }`}>
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string; value: string; icon: typeof Flame; color: string; bg: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">{title}</p>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
          }
