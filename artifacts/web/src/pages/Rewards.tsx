import { useEffect, useState } from "react";
import { Trophy, Flame, BookOpen, Target, Medal, Lock } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { dashboardApi, subjectsApi, quizApi } from "../lib/api";
import type { DashboardSummary, SubjectSummary, LeaderboardEntry } from "@workspace/api-zod";

function currentStreak(days: boolean[]): number {
  let count = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (!days[i]) break;
    count++;
  }
  return count;
}

interface Badge {
  title: string;
  desc: string;
  icon: typeof Trophy;
  earned: boolean;
  color: string;
  bg: string;
}

export function Rewards() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    dashboardApi.summary().then(setDashboard).catch(() => setDashboard(null));
    subjectsApi.list().then(setSubjects).catch(() => setSubjects([]));
    quizApi.leaderboard().then(setLeaderboard).catch(() => setLeaderboard([]));
  }, []);

  const streak = dashboard ? currentStreak(dashboard.streakDays) : 0;
  const masteredSubjects = subjects.filter((s) => s.progressPercent === 100).length;
  const me = leaderboard.find((l) => l.isUser);
  const totalCorrect = me?.totalCorrect ?? 0;
  const rank = me?.rank ?? null;

  const badges: Badge[] = [
    {
      title: "3-Day Streak",
      desc: "Study 3 days in a row",
      icon: Flame,
      earned: streak >= 3,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/40",
    },
    {
      title: "7-Day Streak",
      desc: "Study a full week straight",
      icon: Flame,
      earned: streak >= 7,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/40",
    },
    {
      title: "Subject Master",
      desc: "Complete a subject 100%",
      icon: BookOpen,
      earned: masteredSubjects >= 1,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/40",
    },
    {
      title: "Multi Master",
      desc: "Complete 3 subjects 100%",
      icon: BookOpen,
      earned: masteredSubjects >= 3,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/40",
    },
    {
      title: "Quiz Rookie",
      desc: "Answer 10 quiz questions correctly",
      icon: Target,
      earned: totalCorrect >= 10,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/40",
    },
    {
      title: "Quiz Warrior",
      desc: "Answer 50 quiz questions correctly",
      icon: Target,
      earned: totalCorrect >= 50,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-100 dark:bg-teal-900/40",
    },
    {
      title: "Top 10",
      desc: "Reach the leaderboard top 10",
      icon: Medal,
      earned: rank !== null,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/40",
    },
  ];

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <AppLayout pageTitle="Rewards">
      <div className="p-5 md:p-8 max-w-6xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-yellow-500" /> Rewards
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5">{earnedCount} of {badges.length} badges earned</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Current Streak</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{streak} days</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Subjects Mastered</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{masteredSubjects}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <Medal className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Leaderboard Rank</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{rank !== null ? `#${rank}` : "Unranked"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {badges.map((b) => (
            <div
              key={b.title}
              className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 flex items-start gap-4 ${
                b.earned ? "border-slate-200 dark:border-slate-700 shadow-sm" : "border-dashed border-slate-200 dark:border-slate-700 opacity-60"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${b.earned ? b.bg : "bg-slate-100 dark:bg-slate-700"}`}>
                {b.earned ? <b.icon className={`w-6 h-6 ${b.color}`} /> : <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{b.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
            </h2>
            <div className="flex flex-col gap-1">
              {leaderboard.map((l) => (
                <div key={l.userId} className={`flex items-center p-3 rounded-xl ${l.isUser ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800" : ""}`}>
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold mr-3">
                    {l.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {l.name} {l.isUser && <span className="text-xs font-normal text-blue-600 dark:text-blue-400 ml-1">(You)</span>}
                    </p>
                  </div>
                  <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">{l.totalCorrect}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
              }
