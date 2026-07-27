import { useState, useEffect } from "react";
import { AppLayout } from "./_shared/AppLayout";
import { 
  Play, Clock, Target, CalendarDays, Settings2, BrainCircuit, 
  ChevronRight, Trophy, History, BookOpen, AlertCircle, 
  CheckCircle2, XCircle, SkipForward, ArrowRight, Share2, 
  RotateCcw, Eye, Search, BarChart3, Lightbulb, ChevronLeft
} from "lucide-react";
import "./_group.css";

type ViewState = "hub" | "active" | "results";

const subjects = [
  "Anatomy", "Physiology", "Biochemistry", "Pathology", 
  "Pharmacology", "Microbiology", "Forensic Medicine", "Community Medicine",
  "ENT", "Ophthalmology", "Medicine", "Surgery", "Obstetrics & Gynaecology",
  "Pediatrics", "Orthopedics", "Dermatology", "Psychiatry", "Radiology", "Anesthesia"
];

const quickStarts = [
  { title: "Subject-wise Quiz", desc: "Focus on specific subjects", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Chapter Quiz", desc: "Drill down into chapters", icon: Target, color: "text-purple-600", bg: "bg-purple-100" },
  { title: "Previous Year", desc: "Real exam questions", icon: History, color: "text-amber-600", bg: "bg-amber-100" },
  { title: "Daily Challenge", desc: "Streak & XP boost", icon: CalendarDays, color: "text-emerald-600", bg: "bg-emerald-100" },
  { title: "Custom Quiz", desc: "Build your own mix", icon: Settings2, color: "text-slate-600", bg: "bg-slate-100" },
  { title: "Weak Topics", desc: "Targeted improvement", icon: BrainCircuit, color: "text-rose-600", bg: "bg-rose-100" },
];

const recentQuizzes = [
  { subject: "Pharmacology", score: "22/30", date: "Today", acc: 73, pass: true },
  { subject: "Pathology", score: "45/50", date: "Yesterday", acc: 90, pass: true },
  { subject: "Anatomy", score: "12/25", date: "3 days ago", acc: 48, pass: false },
  { subject: "Microbiology", score: "38/40", date: "4 days ago", acc: 95, pass: true },
  { subject: "Medicine", score: "18/30", date: "1 week ago", acc: 60, pass: true },
];

const leaderboard = [
  { rank: 1, name: "Priya Sharma", score: 9850, subject: "Surgery" },
  { rank: 2, name: "Arjun Mehta", score: 9240, subject: "Pharmacology", isUser: true },
  { rank: 3, name: "Rahul Desai", score: 8900, subject: "Medicine" },
  { rank: 4, name: "Sneha Patel", score: 8450, subject: "Pathology" },
  { rank: 5, name: "Vikram Singh", score: 8120, subject: "Anatomy" },
];

export function QuizSection() {
  const [view, setView] = useState<ViewState>("hub");
  
  return (
    <AppLayout activePage="quiz">
      <div className="min-h-full">
        {view === "hub" && <QuizHub onStart={() => setView("active")} />}
        {view === "active" && <ActiveQuiz onSubmit={() => setView("results")} onQuit={() => setView("hub")} />}
        {view === "results" && <QuizResults onBack={() => setView("hub")} />}
      </div>
    </AppLayout>
  );
}

function QuizHub({ onStart }: { onStart: () => void }) {
  const [search, setSearch] = useState("");
  
  const filteredSubjects = subjects.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quiz Zone</h1>
        <p className="text-slate-500 dark:text-slate-400">Test your knowledge, track your growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {quickStarts.map((qs, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className={`w-10 h-10 rounded-xl ${qs.bg} dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <qs.icon className={`w-5 h-5 ${qs.color} dark:text-slate-300`} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{qs.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{qs.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Subject-wise Quizzes</h2>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search subjects..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {filteredSubjects.map((sub) => (
                <div key={sub} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{sub}</span>
                  <button 
                    onClick={onStart}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-1"
                  >
                    Start <Play className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Quizzes</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentQuizzes.map((q, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{q.subject}</h4>
                    <p className="text-xs text-slate-500">{q.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{q.score}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        q.pass ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                               : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {q.acc}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{q.pass ? 'Pass' : 'Needs Review'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Leaderboard</h2>
            </div>
            <div className="p-3">
              {leaderboard.map((lb) => (
                <div key={lb.rank} className={`flex items-center p-3 rounded-xl mb-1 ${
                  lb.isUser ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800" : ""
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                    lb.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                    lb.rank === 2 ? "bg-slate-200 text-slate-700" :
                    lb.rank === 3 ? "bg-orange-100 text-orange-700" :
                    "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                  }`}>
                    {lb.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {lb.name} {lb.isUser && <span className="text-xs font-normal text-blue-600 dark:text-blue-400 ml-1">(You)</span>}
                    </p>
                    <p className="text-[10px] text-slate-500">{lb.subject}</p>
                  </div>
                  <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {lb.score.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveQuiz({ onSubmit, onQuit }: { onSubmit: () => void, onQuit: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-500">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onQuit} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Pharmacology — Autonomic Pharmacology</h2>
            <p className="text-xs text-slate-500 font-medium">Question 15 of 30</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full font-mono font-bold dark:bg-rose-900/30 dark:text-rose-400">
            <Clock className="w-4 h-4" />
            14:32
          </div>
          <button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
            Submit Quiz
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 shrink-0">
        <div className="h-full bg-blue-500 w-1/2 transition-all duration-500 ease-out" />
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Quiz Area */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="max-w-3xl w-full flex flex-col gap-8 pb-20">
            
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                Clinical Case
              </span>
              <button className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg transition-colors">
                <Lightbulb className="w-4 h-4" />
                Hint (-5 XP)
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg shadow-sm">
                  15
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed">
                  A patient presents with bradycardia, miosis, increased salivation, and bronchospasm. Which drug class is most likely responsible for this presentation?
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
              {[
                { id: "A", text: "Beta-blockers" },
                { id: "B", text: "Anticholinergics" },
                { id: "C", text: "Cholinergic agonists" },
                { id: "D", text: "Alpha-2 agonists" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={`
                    w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                    ${selected === opt.id 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-500/10" 
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-750"
                    }
                  `}
                >
                  {selected === opt.id && (
                    <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-600" />
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                      ${selected === opt.id 
                        ? "bg-blue-600 text-white" 
                        : "bg-slate-100 text-slate-500 dark:bg-slate-700 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }
                    `}>
                      {opt.id}
                    </div>
                    <span className={`text-lg font-medium ${selected === opt.id ? "text-blue-900 dark:text-blue-100" : "text-slate-700 dark:text-slate-300"}`}>
                      {opt.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-700 mt-4">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                  Skip <SkipForward className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar - Navigator */}
        <div className="w-72 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-6 flex flex-col shrink-0">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Question Navigator</h3>
          
          <div className="grid grid-cols-5 gap-2 mb-8">
            {Array.from({ length: 30 }).map((_, i) => {
              const num = i + 1;
              let state = "unseen"; // unseen, current, answered, skipped
              if (num < 15 && num % 4 === 0) state = "skipped";
              else if (num < 15) state = "answered";
              else if (num === 15) state = "current";

              return (
                <button key={num} className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all
                  ${state === "current" ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" :
                    state === "answered" ? "bg-blue-600 text-white" :
                    state === "skipped" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400" :
                    "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                  }
                `}>
                  {num}
                </button>
              );
            })}
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-4 h-4 rounded bg-blue-600" /> Answered (11)
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/50" /> Skipped (3)
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-4 h-4 rounded ring-2 ring-blue-600 bg-blue-100 dark:bg-blue-900/50" /> Current (1)
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-700" /> Unseen (15)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizResults({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full p-8 max-w-6xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 pb-20">
      
      {/* Header Area */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quiz Results</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Pharmacology — Autonomic Pharmacology</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors">
            Back to Hub
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 font-medium rounded-xl transition-colors">
            <Share2 className="w-4 h-4" /> Share Score
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Score Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-green-500" />
          
          <h2 className="text-green-600 dark:text-green-400 font-bold text-xl mb-6">Good Performance!</h2>
          
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-700" />
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="251.2" strokeDashoffset="67.8" className="text-green-500" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">73<span className="text-2xl text-slate-400">%</span></span>
              <span className="text-sm font-bold text-slate-500 mt-1">22 / 30</span>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <button className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
              <Eye className="w-4 h-4" /> Review Answers
            </button>
            <button className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
              <RotateCcw className="w-4 h-4" /> Retry Quiz
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">22</div>
            <div className="text-sm font-medium text-slate-500">Correct</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
            <XCircle className="w-8 h-8 text-rose-500 mb-3" />
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">5</div>
            <div className="text-sm font-medium text-slate-500">Incorrect</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
            <SkipForward className="w-8 h-8 text-amber-500 mb-3" />
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">3</div>
            <div className="text-sm font-medium text-slate-500">Skipped</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
            <Clock className="w-8 h-8 text-blue-500 mb-3" />
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">23:40</div>
            <div className="text-sm font-medium text-slate-500">Time Taken</div>
          </div>
          
          <div className="col-span-2 md:col-span-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-3xl p-6 border border-yellow-200 dark:border-yellow-900/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Trophy className="w-6 h-6 text-yellow-900" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">XP Earned</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Great job staying consistent!</p>
              </div>
            </div>
            <div className="text-3xl font-black text-yellow-600 dark:text-yellow-500 tracking-tight">
              +180 XP
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Topic Breakdown</h3>
          </div>
          
          <div className="space-y-5">
            {[
              { name: "Adrenergic Agonists", acc: 85, color: "bg-green-500" },
              { name: "Cholinergic System", acc: 40, color: "bg-rose-500" },
              { name: "Receptor Profiles", acc: 100, color: "bg-green-500" },
              { name: "Drug Interactions", acc: 55, color: "bg-amber-500" },
            ].map(topic => (
              <div key={topic.name}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700 dark:text-slate-300">{topic.name}</span>
                  <span className="text-slate-900 dark:text-white">{topic.acc}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${topic.color} rounded-full`} style={{ width: `${topic.acc}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weak Topics Identified</h3>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Based on your incorrect answers, we recommend reviewing these specific areas before your next attempt.
          </p>

          <div className="space-y-3 mb-8 flex-1">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30">
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-rose-900 dark:text-rose-300">Cholinergic System</h4>
                <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">You missed 3 out of 5 questions in this section.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30">
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-rose-900 dark:text-rose-300">Drug Interactions</h4>
                <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">Focus on anticholinergic toxicities.</p>
              </div>
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-colors">
            Generate Weak Topics Quiz <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
