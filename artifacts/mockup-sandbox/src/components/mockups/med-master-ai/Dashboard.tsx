import { useState, useEffect } from "react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";
import { 
  PlayCircle, BookOpen, Brain, Clock, Target, Activity, Flame, ChevronRight,
  Trophy, CheckCircle2, FileText, Medal, Calendar, ArrowRight, Layers, X
} from "lucide-react";

export function Dashboard() {
  // Timer
  const [studyTimeSeconds, setStudyTimeSeconds] = useState(2 * 3600 + 14 * 60);
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Goals
  const [goals, setGoals] = useState({
    chapters: { current: 1, target: 3 },
    mcqs: { current: 8, target: 20 },
    videos: { current: 0, target: 2 }
  });
  const [completedMsg, setCompletedMsg] = useState("");

  const handleIncrementGoal = (key: keyof typeof goals, name: string) => {
    setGoals(prev => {
      const goal = prev[key];
      if (goal.current < goal.target) {
        const newCurrent = goal.current + 1;
        if (newCurrent === goal.target) {
          setCompletedMsg(`${name} goal complete!`);
          setTimeout(() => setCompletedMsg(""), 3000);
        }
        return { ...prev, [key]: { ...goal, current: newCurrent } };
      }
      return prev;
    });
  };

  const totalGoals = goals.chapters.target + goals.mcqs.target + goals.videos.target;
  const totalCompleted = goals.chapters.current + goals.mcqs.current + goals.videos.current;
  const goalsPercent = Math.round((totalCompleted / totalGoals) * 100);

  // Continue Learning Toast
  const [showToast, setShowToast] = useState(false);
  const handleContinueLearning = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Leaderboard Modal
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Upcoming Tooltips
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  // Streak week dots
  const [streakDays, setStreakDays] = useState([true, true, true, true, true, true, false]);
  const toggleStreak = (index: number) => {
    setStreakDays(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <AppLayout activePage="dashboard">
      <div className="max-w-7xl mx-auto p-5 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              July 21, 2026 • Monday
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, Arjun 👋
            </h1>
          </div>
          
          {/* Level / XP */}
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm min-w-[280px]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-4 shadow-inner">
              <Medal className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Level 7</span>
                <span className="text-[11px] font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">Clinical Resident</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 text-right font-medium">350 XP to Level 8</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard 
            icon={Clock} 
            label="Study Time Today" 
            value={
              <div className="flex items-center gap-2">
                {formatTime(studyTimeSeconds)}
                <span className="relative flex h-3 w-3 mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            } 
            trend="+12% from yesterday" 
            color="blue" 
          />
          <StatCard icon={Calendar} label="Weekly Hours" value="14h 30m" trend="On track for 20h" color="indigo" />
          <StatCard icon={Brain} label="Questions Solved" value="847" trend="Top 15% this week" color="purple" />
          <StatCard icon={Target} label="Accuracy" value="73%" trend="+4% this month" color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Focus) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Continue Learning */}
            <div className="relative rounded-3xl overflow-hidden shadow-md group border border-slate-200 dark:border-slate-700/50">
              <div className="absolute inset-0 z-0 bg-blue-950">
                <img 
                  src="/__mockup/images/anatomy-heart.jpg" 
                  alt="Cardiovascular System"
                  className="w-full h-full object-cover opacity-40 mix-blend-screen group-hover:scale-105 transition-transform duration-1000 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent"></div>
              </div>
              
              <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-start justify-between gap-8 min-h-[280px]">
                <div className="max-w-xl flex flex-col h-full w-full">
                  <div className="flex items-center gap-3 text-slate-300 text-sm font-medium mb-4">
                    <span className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 text-white font-semibold tracking-wide">Anatomy</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Last studied 2h ago</span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                    Cardiovascular System
                  </h2>
                  <p className="text-blue-200 text-lg mb-8 font-medium">Chapter 4: Heart Chambers & Valves</p>
                  
                  <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-6 w-full">
                    <button 
                      onClick={handleContinueLearning}
                      className="bg-white hover:bg-slate-50 text-blue-900 px-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 shrink-0 group/btn"
                    >
                      <PlayCircle className="w-5 h-5 text-blue-600 group-hover/btn:scale-110 transition-transform" />
                      Continue Learning
                    </button>
                    
                    <div className="flex-1 w-full max-w-[280px]">
                      <div className="flex justify-between text-sm font-semibold text-blue-200 mb-2">
                        <span>Progress</span>
                        <span className="text-white">68%</span>
                      </div>
                      <div className="h-2 w-full bg-blue-900/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                        <div className="h-full bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Today's Goals */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-7 relative overflow-hidden">
                {completedMsg && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg z-10 animate-in slide-in-from-top-4 fade-in duration-300 whitespace-nowrap">
                    {completedMsg}
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Today's Goals</h3>
                    <p className="text-sm text-slate-500 mt-1">You're making great progress.</p>
                  </div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-4 border-slate-100 dark:border-slate-700 relative">
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
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{goalsPercent}%</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <GoalRow 
                    label="Read Chapters" 
                    current={goals.chapters.current} 
                    target={goals.chapters.target} 
                    icon={BookOpen} 
                    color="blue" 
                    onIncrement={() => handleIncrementGoal("chapters", "Read Chapters")}
                  />
                  <GoalRow 
                    label="Solve MCQs" 
                    current={goals.mcqs.current} 
                    target={goals.mcqs.target} 
                    icon={Brain} 
                    color="purple" 
                    onIncrement={() => handleIncrementGoal("mcqs", "Solve MCQs")}
                  />
                  <GoalRow 
                    label="Watch Videos" 
                    current={goals.videos.current} 
                    target={goals.videos.target} 
                    icon={PlayCircle} 
                    color="pink" 
                    onIncrement={() => handleIncrementGoal("videos", "Watch Videos")}
                  />
                </div>
              </div>

              {/* Subject Progress */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-7">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Subject Mastery</h3>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                    View All <ChevronRight className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <SubjectProgress name="Anatomy" percent={68} delay={100} />
                  <SubjectProgress name="Pathology" percent={52} delay={200} />
                  <SubjectProgress name="Physiology" percent={45} delay={300} />
                  <SubjectProgress name="Microbiology" percent={38} delay={400} />
                  <SubjectProgress name="Biochemistry" percent={30} delay={500} />
                  <SubjectProgress name="Pharmacology" percent={20} delay={600} />
                </div>
              </div>
            </div>

          </div>
          
          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Streak */}
            <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-7 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden group">
              <Flame className="absolute -right-6 -bottom-6 w-40 h-40 text-white/10 rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                    <Flame className="w-5 h-5 text-yellow-300" />
                  </div>
                  <span className="font-bold text-orange-50 uppercase tracking-widest text-[10px]">Study Streak</span>
                </div>
                <div className="text-5xl font-black mb-2 tracking-tight">12 <span className="text-2xl text-orange-200 font-bold">Days</span></div>
                <p className="text-orange-50 text-sm font-medium mb-5 leading-relaxed">You're on fire! 🔥 Complete a goal today to protect your streak.</p>
                
                {/* Week view */}
                <div className="flex justify-between items-center mt-2 bg-black/15 rounded-xl p-3.5 backdrop-blur-sm border border-white/10">
                  {['W', 'T', 'F', 'S', 'S', 'M', 'T'].map((day, i) => {
                    const isCompleted = streakDays[i];
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-orange-200">{day}</span>
                        <div 
                          onClick={() => toggleStreak(i)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-inner cursor-pointer transition-all duration-300
                            ${isCompleted ? 'bg-white text-orange-600 shadow-white/50 scale-100' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 scale-95'}
                          `}
                        >
                          {isCompleted && <CheckCircle2 className="w-4 h-4 animate-in zoom-in" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-blue-500" /> Upcoming
              </h3>
              
              <div className="space-y-3">
                <div 
                  className="relative group flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer"
                  onClick={() => setOpenTooltip(openTooltip === 'flashcards' ? null : 'flashcards')}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">42 Flashcards Due</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Spaced repetition review</p>
                  </div>
                  <div className="ml-auto w-8 h-8 flex items-center justify-center rounded-full text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all pt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  
                  {openTooltip === 'flashcards' && (
                    <div className="absolute top-[110%] left-0 mt-2 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl z-20 w-56 animate-in fade-in slide-in-from-top-1">
                      Contains 42 cards from Anatomy & Pathology. Accuracy history: 85%.
                      <div className="absolute -top-1 left-6 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  )}
                </div>
                
                <div 
                  className="relative group flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors cursor-pointer"
                  onClick={() => setOpenTooltip(openTooltip === 'mock' ? null : 'mock')}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Mock Test</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Opens in 2 days</p>
                  </div>
                  
                  {openTooltip === 'mock' && (
                    <div className="absolute top-[110%] left-0 mt-2 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl z-20 w-56 animate-in fade-in slide-in-from-top-1">
                      100 questions covering all subjects. Estimated time: 2 hours.
                      <div className="absolute -top-1 left-6 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leaderboard Mini */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">This Week</span>
              </div>
              
              <div className="space-y-2">
                <LeaderboardRow rank={1} name="Sarah Jenkins" xp="4,250" avatar="/__mockup/images/avatar-1.jpg" isUser={false} />
                <LeaderboardRow rank={2} name="Michael Chen" xp="3,920" avatar="/__mockup/images/avatar-2.jpg" isUser={false} />
                <LeaderboardRow rank={3} name="Arjun Mehta" xp="3,410" avatar="A" isUser={true} />
              </div>
              
              <button 
                onClick={() => setIsLeaderboardOpen(true)}
                className="w-full mt-5 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                View Full Rankings
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">Recent Activity</h3>
              <div className="relative ml-3 space-y-0">
                <ActivityItem icon={Brain} text="Completed a flashcard deck" time="2h ago" color="blue" isLast={false} />
                <ActivityItem icon={Target} text="Solved 15 Pathology MCQs" time="4h ago" color="purple" isLast={false} />
                <ActivityItem icon={PlayCircle} text="Watched 'Heart Valves' video" time="Yesterday" color="pink" isLast={false} />
                <ActivityItem icon={Medal} text="Earned 'Fast Learner' badge" time="Yesterday" color="yellow" isLast={false} />
                <ActivityItem icon={FileText} text="Read 'Cellular Injury' PDF" time="2 days ago" color="green" isLast={true} />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="font-semibold tracking-wide">Opening Cardiovascular System...</span>
        </div>
      )}

      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-extrabold flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                Full Rankings
              </h2>
              <button 
                onClick={() => setIsLeaderboardOpen(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-2 -mr-2 pb-2 custom-scrollbar">
              <LeaderboardRow rank={1} name="Sarah Jenkins" xp="4,250" avatar="/__mockup/images/avatar-1.jpg" isUser={false} />
              <LeaderboardRow rank={2} name="Michael Chen" xp="3,920" avatar="/__mockup/images/avatar-2.jpg" isUser={false} />
              <LeaderboardRow rank={3} name="Arjun Mehta" xp="3,410" avatar="A" isUser={true} />
              <LeaderboardRow rank={4} name="Emily Davis" xp="3,150" avatar="E" isUser={false} />
              <LeaderboardRow rank={5} name="James Wilson" xp="2,840" avatar="J" isUser={false} />
              <LeaderboardRow rank={6} name="Sophia Taylor" xp="2,610" avatar="S" isUser={false} />
              <LeaderboardRow rank={7} name="Liam Moore" xp="2,380" avatar="L" isUser={false} />
              <LeaderboardRow rank={8} name="Olivia Martin" xp="2,150" avatar="O" isUser={false} />
              <LeaderboardRow rank={9} name="Noah Jackson" xp="1,920" avatar="N" isUser={false} />
              <LeaderboardRow rank={10} name="Isabella White" xp="1,750" avatar="I" isUser={false} />
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
}

// --- Subcomponents ---

function StatCard({ icon: Icon, label, value, trend, color }: { icon: any, label: string, value: React.ReactNode, trend: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 lg:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-tight pr-2">{label}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</div>
        <div className="text-xs font-semibold text-slate-400 mt-1.5">{trend}</div>
      </div>
    </div>
  );
}

function GoalRow({ label, current, target, icon: Icon, color, onIncrement }: { label: string, current: number, target: number, icon: any, color: string, onIncrement?: () => void }) {
  const percent = Math.min(100, Math.round((current / target) * 100));
  const isComplete = current >= target;
  
  const colorMap: Record<string, { bg: string, fill: string, text: string }> = {
    blue: { bg: "bg-blue-100 dark:bg-blue-900/40", fill: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
    purple: { bg: "bg-purple-100 dark:bg-purple-900/40", fill: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" },
    pink: { bg: "bg-pink-100 dark:bg-pink-900/40", fill: "bg-pink-500", text: "text-pink-600 dark:text-pink-400" },
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between text-sm mb-2.5">
        <div className="flex items-center gap-2.5 font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          <div className={`p-1.5 rounded-lg ${colorMap[color].bg}`}>
            <Icon className={`w-3.5 h-3.5 ${colorMap[color].text}`} />
          </div>
          {label}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            {current} <span className="text-slate-400 font-medium">/ {target}</span>
            {isComplete && <CheckCircle2 className="w-4 h-4 text-green-500 animate-in zoom-in" />}
          </span>
          {!isComplete && onIncrement && (
            <button 
              onClick={onIncrement}
              className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${colorMap[color].fill} hover:brightness-110 active:scale-95 transition-all shadow-sm`}
            >
              +
            </button>
          )}
        </div>
      </div>
      <div className={`h-2.5 w-full rounded-full overflow-hidden ${colorMap[color].bg}`}>
        <div className={`h-full rounded-full ${colorMap[color].fill} transition-all duration-1000 ease-out`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function SubjectProgress({ name, percent, delay }: { name: string, percent: number, delay: number }) {
  const [currentPercent, setCurrentPercent] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPercent(percent);
    }, delay);
    return () => clearTimeout(timer);
  }, [percent, delay]);

  return (
    <div className="group">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{name}</span>
        <span className="font-bold text-slate-900 dark:text-white">{percent}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${currentPercent}%` }}
        ></div>
      </div>
    </div>
  );
}

function LeaderboardRow({ rank, name, xp, avatar, isUser }: { rank: number, name: string, xp: string, avatar: string, isUser: boolean }) {
  const isTop = rank === 1;
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-2xl transition-colors ${isUser ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'}`}>
      <div className={`w-6 text-center font-extrabold text-sm ${isTop ? 'text-yellow-500' : 'text-slate-400'}`}>
        {rank}
      </div>
      <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm
        ${avatar.length === 1 ? 'bg-gradient-to-br from-green-400 to-teal-500' : 'bg-slate-200'}
      `}>
        {avatar.length === 1 ? avatar : <img src={avatar} alt={name} className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-bold truncate ${isUser ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
          {name} {isUser && <span className="font-medium text-blue-500 ml-1">(You)</span>}
        </div>
        <div className="text-[11px] font-semibold text-slate-500">{xp} XP</div>
      </div>
      {isTop && <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
    </div>
  );
}

function ActivityItem({ icon: Icon, text, time, color, isLast }: { icon: any, text: string, time: string, color: string, isLast: boolean }) {
  const colorMap: Record<string, { bg: string, ring: string, icon: string }> = {
    blue: { bg: "bg-blue-500", ring: "ring-blue-100 dark:ring-blue-900/50", icon: "text-blue-500" },
    purple: { bg: "bg-purple-500", ring: "ring-purple-100 dark:ring-purple-900/50", icon: "text-purple-500" },
    pink: { bg: "bg-pink-500", ring: "ring-pink-100 dark:ring-pink-900/50", icon: "text-pink-500" },
    yellow: { bg: "bg-yellow-500", ring: "ring-yellow-100 dark:ring-yellow-900/50", icon: "text-yellow-500" },
    green: { bg: "bg-green-500", ring: "ring-green-100 dark:ring-green-900/50", icon: "text-green-500" },
  };

  return (
    <div className={`relative pl-7 ${isLast ? 'pb-0' : 'pb-6 border-l-2 border-slate-100 dark:border-slate-700'}`}>
      {/* Node */}
      <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${colorMap[color].bg} shadow-sm`}></div>
      
      <div className="flex gap-3 items-start">
        <div className={`mt-0.5 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 ${colorMap[color].icon}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 pb-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight mt-0.5">{text}</p>
          <p className="text-xs font-medium text-slate-400 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}
