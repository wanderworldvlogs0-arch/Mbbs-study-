import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";
import { 
  Layers, 
  Brain, 
  CheckCircle2, 
  Trophy, 
  Play, 
  Clock, 
  RotateCcw, 
  Shuffle, 
  Bookmark, 
  X,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Info,
  BookOpen,
  HeartPulse
} from "lucide-react";

// --- Data ---
const CARDS = [
  { front: "What is the name of the valve between the left atrium and left ventricle?", back: "Mitral Valve (Bicuspid Valve)", mnemonic: "M for Mitral = 2 cusps. Left side = M comes before T in the alphabet but Left before Right. MLB: Mitral = Left Bicuspid.", ref: "Gray's Anatomy Ch.4" },
  { front: "What are the borders of the triangle of auscultation?", back: "Trapezius, Latissimus dorsi, Medial border of scapula", mnemonic: "TLM: Triangle = Trapezius, Latissimus, Medial scapula.", ref: "Gray's Anatomy Ch.2" },
  { front: "Which nerve is most commonly injured in a fractured surgical neck of humerus?", back: "Axillary nerve (C5, C6)", mnemonic: "Surgical Neck → Axillary Nerve. Both contain the letter 'Ax'.", ref: "Gray's Anatomy Ch.7" },
  { front: "What is the vertebral level of the sternal angle (angle of Louis)?", back: "T4-T5 intervertebral disc level", mnemonic: "Louis XIV → L = 4 → T4-T5. The angle is your 'Louis level'.", ref: "Gray's Anatomy Ch.5" },
  { front: "Which muscle is called the 'boxer's muscle' or 'muscle of the punching arm'?", back: "Serratus anterior", mnemonic: "Serratus = Serrated like a saw → punching motion. Innervated by Long Thoracic nerve (C5,6,7 — Keep the Diaphragm Alive).", ref: "Gray's Anatomy Ch.3" },
  { front: "What is the name of the bony landmark at the lower end of the sternum?", back: "Xiphoid process (Xiphisternum)", mnemonic: "X marks the spot at the bottom of the sternum — Xiphoid starts with X.", ref: "Gray's Anatomy Ch.5" },
  { front: "The femoral triangle: what are its boundaries?", back: "Superiorly: Inguinal ligament. Laterally: Sartorius. Medially: Adductor longus. Floor: Iliopsoas + Pectineus.", mnemonic: "SAIL: Sartorius, Adductor longus, Inguinal ligament — the outer walls of the femoral triangle.", ref: "Gray's Anatomy Ch.9" },
  { front: "What passes through the foramen ovale of the skull base?", back: "Mandibular nerve (V3), Accessory meningeal artery, Lesser petrosal nerve", mnemonic: "OVAL = V3 passes through. Remember: 'V3 OVALe'.", ref: "Gray's Anatomy Ch.8" },
  { front: "Where does the thoracic duct begin and terminate?", back: "Begins at cisterna chyli (L1-L2), terminates at junction of left subclavian and left internal jugular veins.", mnemonic: "Thoracic duct: 'Left luggage' — it always drains to the LEFT.", ref: "Gray's Anatomy Ch.5" },
  { front: "What is the 'carrying angle' of the elbow and which gender has a larger angle?", back: "The angle between the arm and forearm in extension. Normal: 5-15° males, 10-25° females. Females have larger carrying angle.", mnemonic: "Females CARRY more → larger carrying angle.", ref: "Gray's Anatomy Ch.7" },
];

const subjects = [
  { id: 'anatomy', name: 'Anatomy', total: 840, due: 15, mastery: 82, color: 'text-blue-600', bg: 'bg-blue-100', stroke: '#2563eb' },
  { id: 'physiology', name: 'Physiology', total: 650, due: 8, mastery: 75, color: 'text-green-600', bg: 'bg-green-100', stroke: '#16a34a' },
  { id: 'biochemistry', name: 'Biochemistry', total: 540, due: 0, mastery: 90, color: 'text-purple-600', bg: 'bg-purple-100', stroke: '#9333ea' },
  { id: 'pathology', name: 'Pathology', total: 1200, due: 22, mastery: 64, color: 'text-rose-600', bg: 'bg-rose-100', stroke: '#e11d48' },
  { id: 'pharmacology', name: 'Pharmacology', total: 980, due: 45, mastery: 58, color: 'text-orange-600', bg: 'bg-orange-100', stroke: '#ea580c' },
  { id: 'microbiology', name: 'Microbiology', total: 720, due: 12, mastery: 71, color: 'text-teal-600', bg: 'bg-teal-100', stroke: '#0d9488' },
  { id: 'forensic', name: 'Forensic Medicine', total: 340, due: 0, mastery: 95, color: 'text-blue-600', bg: 'bg-blue-100', stroke: '#2563eb' },
  { id: 'psm', name: 'Prev. & Social Med', total: 890, due: 18, mastery: 68, color: 'text-green-600', bg: 'bg-green-100', stroke: '#16a34a' },
  { id: 'ophthalmology', name: 'Ophthalmology', total: 450, due: 5, mastery: 84, color: 'text-purple-600', bg: 'bg-purple-100', stroke: '#9333ea' },
  { id: 'ent', name: 'ENT', total: 420, due: 2, mastery: 88, color: 'text-rose-600', bg: 'bg-rose-100', stroke: '#e11d48' },
  { id: 'medicine', name: 'General Medicine', total: 1500, due: 54, mastery: 45, color: 'text-orange-600', bg: 'bg-orange-100', stroke: '#ea580c' },
  { id: 'surgery', name: 'General Surgery', total: 1300, due: 38, mastery: 52, color: 'text-teal-600', bg: 'bg-teal-100', stroke: '#0d9488' },
  { id: 'obgyn', name: 'Obstetrics & Gynecology', total: 950, due: 14, mastery: 76, color: 'text-blue-600', bg: 'bg-blue-100', stroke: '#2563eb' },
  { id: 'pediatrics', name: 'Pediatrics', total: 820, due: 9, mastery: 79, color: 'text-green-600', bg: 'bg-green-100', stroke: '#16a34a' },
  { id: 'orthopedics', name: 'Orthopedics', total: 640, due: 7, mastery: 81, color: 'text-purple-600', bg: 'bg-purple-100', stroke: '#9333ea' },
  { id: 'psychiatry', name: 'Psychiatry', total: 380, due: 0, mastery: 92, color: 'text-rose-600', bg: 'bg-rose-100', stroke: '#e11d48' },
  { id: 'dermatology', name: 'Dermatology', total: 410, due: 4, mastery: 86, color: 'text-orange-600', bg: 'bg-orange-100', stroke: '#ea580c' },
  { id: 'anesthesiology', name: 'Anesthesiology', total: 290, due: 1, mastery: 94, color: 'text-teal-600', bg: 'bg-teal-100', stroke: '#0d9488' },
  { id: 'radiology', name: 'Radiology', total: 510, due: 6, mastery: 83, color: 'text-blue-600', bg: 'bg-blue-100', stroke: '#2563eb' },
];

export function Flashcards() {
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const startSession = (subjectId?: string) => {
    setActiveSubjectId(subjectId || null);
    setActiveSession(true);
  };

  return (
    <AppLayout activePage="flashcards">
      {activeSession ? (
        <ActiveSessionView 
          activeSubjectId={activeSubjectId}
          onExit={() => { setActiveSession(false); setActiveSubjectId(null); }} 
        />
      ) : (
        <FlashcardHub 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          onStartSession={startSession} 
        />
      )}
    </AppLayout>
  );
}

function FlashcardHub({ 
  activeFilter, 
  setActiveFilter,
  onStartSession
}: { 
  activeFilter: string; 
  setActiveFilter: (f: string) => void;
  onStartSession: (subjectId?: string) => void;
}) {
  const filters = ["All", "Due Today", "New", "Mastered"];

  const filteredSubjects = subjects.filter(subject => {
    if (activeFilter === "Due Today") return subject.due > 0;
    if (activeFilter === "New") return subject.mastery < 60;
    if (activeFilter === "Mastered") return subject.mastery > 85;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-blue-600" />
            Flashcards
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Your spaced repetition engine</p>
        </div>
        <button 
          onClick={() => onStartSession()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Review Session
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard title="Due Today" value="45" icon={Clock} color="text-orange-500" bg="bg-orange-50" />
        <StatCard title="New" value="12" icon={Brain} color="text-blue-500" bg="bg-blue-50" />
        <StatCard title="Learning" value="28" icon={RotateCcw} color="text-purple-500" bg="bg-purple-50" />
        <StatCard title="Mastered" value="189" icon={Trophy} color="text-green-500" bg="bg-green-50" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === f 
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" 
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredSubjects.map(subject => (
          <SubjectCard key={subject.id} subject={subject} onStart={() => onStartSession(subject.id)} />
        ))}
        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
            No subjects match this filter.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bg} dark:bg-opacity-10 flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

function SubjectCard({ subject, onStart }: { subject: any, onStart: () => void }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (subject.mastery / 100) * circumference;

  return (
    <div 
      onClick={onStart}
      className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl ${subject.bg} dark:bg-opacity-10 flex items-center justify-center`}>
          <BookOpen className={`w-5 h-5 ${subject.color}`} />
        </div>
        
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="transform -rotate-90 w-14 h-14">
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-slate-700" />
            <circle cx="28" cy="28" r="24" stroke={subject.stroke} strokeWidth="4" fill="transparent" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-300">{subject.mastery}%</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{subject.name}</h3>
      
      <div className="flex items-center gap-4 text-sm mt-4">
        <div className="flex flex-col">
          <span className="text-slate-400 dark:text-slate-500 text-xs">Total</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{subject.total}</span>
        </div>
        <div className="w-px h-8 bg-slate-100 dark:bg-slate-700"></div>
        <div className="flex flex-col">
          <span className="text-slate-400 dark:text-slate-500 text-xs">Due</span>
          <span className={`font-semibold ${subject.due > 0 ? "text-orange-600 dark:text-orange-400" : "text-slate-700 dark:text-slate-300"}`}>
            {subject.due > 0 ? `${subject.due} cards` : "All caught up!"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActiveSessionView({ activeSubjectId, onExit }: { activeSubjectId: string | null, onExit: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardIndices, setCardIndices] = useState(() => Array.from({length: CARDS.length}, (_, i) => i));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<'again' | 'hard' | 'good' | 'easy' | null>>(
    Array(CARDS.length).fill(null)
  );
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const totalCards = CARDS.length;
  const currentCardIndex = cardIndices[currentIndex];
  const card = CARDS[currentCardIndex];
  
  const subjectName = activeSubjectId 
    ? subjects.find(s => s.id === activeSubjectId)?.name 
    : "Mixed Review";

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const handleShuffle = () => {
    const newIndices = [...cardIndices];
    for (let i = newIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newIndices[i], newIndices[j]] = [newIndices[j], newIndices[i]];
    }
    setCardIndices(newIndices);
    setCurrentIndex(0);
    setAnswers(Array(CARDS.length).fill(null));
    setIsFlipped(false);
    setTimer(0);
  };

  const handleAnswer = useCallback((rating: 'again' | 'hard' | 'good' | 'easy') => {
    setAnswers(prev => {
      const next = [...prev];
      next[currentCardIndex] = rating;
      return next;
    });
    
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < totalCards - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        setIsFinished(true);
      }
    }, 150);
  }, [currentIndex, currentCardIndex, totalCards]);

  const handleBookmark = () => {
    setBookmarked(prev => {
      const next = new Set(prev);
      if (next.has(currentCardIndex)) next.delete(currentCardIndex);
      else next.add(currentCardIndex);
      return next;
    });
  };

  useEffect(() => {
    if (isFinished) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(f => !f);
      } else if (isFlipped) {
        if (e.key === '1') { e.preventDefault(); handleAnswer('again'); }
        if (e.key === '2') { e.preventDefault(); handleAnswer('hard'); }
        if (e.key === '3') { e.preventDefault(); handleAnswer('good'); }
        if (e.key === '4') { e.preventDefault(); handleAnswer('easy'); }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setIsFlipped(false);
          setTimeout(() => {
            if (currentIndex < totalCards - 1) {
              setCurrentIndex(c => c + 1);
            } else {
              setIsFinished(true);
            }
          }, 150);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, totalCards, isFinished, handleAnswer]);

  const reviewedCount = answers.filter(a => a !== null).length;
  const correctCount = answers.filter(a => a === 'good' || a === 'easy').length;
  const accuracy = reviewedCount > 0 ? Math.round((correctCount / reviewedCount) * 100) : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { m, s };
  };
  const { m, s } = formatTime(timer);
  const isBookmarked = bookmarked.has(currentCardIndex);

  if (isFinished) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 animate-in fade-in zoom-in duration-500 px-6">
        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Session Complete!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Great job sticking to your study goals.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Time</span>
              <span className="text-2xl font-semibold text-slate-900 dark:text-white">{m}:{s}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Accuracy</span>
              <span className="text-2xl font-semibold text-green-500">{accuracy}%</span>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-2xl p-4 font-semibold mb-8 border border-blue-100 dark:border-blue-900/30 flex justify-center items-center gap-2">
            <span className="text-xl">+95 XP Earned</span>
          </div>
          
          <button 
            onClick={onExit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-in slide-in-from-bottom-4 duration-500">
      {/* Topbar */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-950 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider truncate max-w-[200px] md:max-w-xs">{subjectName}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{currentIndex + 1} / {totalCards}</span>
              <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShuffle}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" 
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button 
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors relative ${
              isBookmarked 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                : 'text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`} 
            title="Bookmark"
          >
            <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
            {bookmarked.size > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {bookmarked.size}
              </span>
            )}
          </button>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <button 
            onClick={onExit}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            <span className="text-sm font-medium pr-1 hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Card Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
          
          {/* Card Container with 3D perspective */}
          <div 
            className="relative w-full max-w-2xl aspect-[4/3] md:aspect-[16/10] group cursor-pointer mb-8" 
            style={{ perspective: '1200px' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div 
              className="w-full h-full relative transition-transform duration-700 ease-out shadow-2xl rounded-3xl"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* FRONT FACE */}
              <div 
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col p-8 md:p-12 overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-wide mb-8">
                  <HeartPulse className="w-5 h-5 shrink-0" />
                  <span className="truncate">ANATOMY — Flashcard</span>
                </div>
                
                <div className="flex-1 flex items-center justify-center text-center">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-slate-800 dark:text-slate-100 leading-snug">
                    {card.front}
                  </h2>
                </div>

                <div className="mt-auto text-center text-slate-400 dark:text-slate-500 text-sm flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Tap anywhere to flip card
                </div>
              </div>

              {/* BACK FACE */}
              <div 
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col p-8 md:p-12 overflow-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400 font-semibold text-sm tracking-wide mb-6 opacity-80 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                  ANSWER
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center overflow-y-auto overflow-x-hidden no-scrollbar">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6 text-blue-700 dark:text-blue-400 leading-tight">
                    {card.back.includes('(') ? (
                      <>
                        {card.back.split('(')[0].trim()}
                        <span className="block text-xl md:text-2xl font-medium text-slate-500 dark:text-slate-400 mt-2">
                          ({card.back.split('(').slice(1).join('(')}
                        </span>
                      </>
                    ) : (
                      card.back
                    )}
                  </h2>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-2xl p-4 md:p-5 text-sm border border-yellow-200 dark:border-yellow-900/50 flex flex-col items-start gap-2 w-full text-left shadow-inner">
                    <div className="flex items-center gap-2 font-bold mb-1 shrink-0">
                      <Info className="w-5 h-5" />
                      Mnemonic
                    </div>
                    <p className="leading-relaxed">
                      {card.mnemonic}
                    </p>
                  </div>
                </div>

                <div className="mt-4 shrink-0 text-center text-slate-400 dark:text-slate-500 text-xs md:text-sm flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {card.ref}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`transition-all duration-500 flex flex-col items-center ${isFlipped ? "opacity-100 translate-y-0" : "opacity-30 pointer-events-none translate-y-4"}`}>
            <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm font-medium">How well did you know this?</p>
            <div className="flex gap-2 md:gap-4 flex-wrap justify-center">
              <SpacedRepButton label="Again" time="< 1m" color="bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800" onClick={() => handleAnswer('again')} />
              <SpacedRepButton label="Hard" time="6m" color="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800" onClick={() => handleAnswer('hard')} />
              <SpacedRepButton label="Good" time="10m" color="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800" onClick={() => handleAnswer('good')} />
              <SpacedRepButton label="Easy" time="4d" color="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800" onClick={() => handleAnswer('easy')} />
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-2">
               <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-200 dark:border-slate-700">
                  <span className="flex items-center gap-1"><kbd className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600 font-mono text-[10px]">Space</kbd> Flip</span>
                  <span className="w-px h-3 bg-slate-300 dark:bg-slate-600 hidden md:block"></span>
                  <span className="flex items-center gap-1"><kbd className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600 font-mono text-[10px]">1</kbd>-<kbd className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600 font-mono text-[10px]">4</kbd> Rate</span>
                  <span className="w-px h-3 bg-slate-300 dark:bg-slate-600 hidden md:block"></span>
                  <span className="flex items-center gap-1"><kbd className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600 font-mono text-[10px]">→</kbd> Next</span>
               </div>
            </div>
          </div>
          
        </div>

        {/* Right: Stats Sidebar */}
        <div className="hidden lg:flex w-80 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 p-6 flex-col">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider text-sm">Session Stats</h3>
          
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">Time Elapsed</span>
              <span className="text-3xl font-light text-slate-900 dark:text-white flex items-center gap-1">
                {m}<span className="text-xl text-slate-400 -mt-1">:</span>{s}
              </span>
            </div>
            
            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
            
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-sm mb-2 block">Accuracy</span>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-semibold text-green-500">{accuracy}%</span>
                <span className="text-slate-400 text-sm mb-1">correct</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                {reviewedCount > 0 && (
                  <>
                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${accuracy}%` }}></div>
                    <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${100 - accuracy}%` }}></div>
                  </>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 text-xs block mb-1">Remaining</span>
                <span className="text-xl font-semibold text-slate-900 dark:text-white">{totalCards - currentIndex}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 text-xs block mb-1">Reviewed</span>
                <span className="text-xl font-semibold text-slate-900 dark:text-white">{reviewedCount}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/50">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Streak Maintained!
            </h4>
            <p className="text-blue-600/80 dark:text-blue-400/80 text-sm leading-relaxed">
              You've studied for 12 days in a row. Finish this session to keep it going!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpacedRepButton({ label, time, color, onClick }: any) {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`px-5 py-2.5 md:px-8 md:py-4 rounded-2xl border transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-1 ${color}`}
    >
      <span className="font-bold text-sm md:text-lg">{label}</span>
      <span className="text-[10px] md:text-xs opacity-70 font-medium">{time}</span>
    </button>
  );
}
