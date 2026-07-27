import React, { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";
import {
  Bone, Activity, FlaskConical, Microscope, Pill, Bug, Scale, Users, Ear, Eye, 
  Stethoscope, Scissors, Baby, Scan, Brain, Radio, Syringe,
  ChevronLeft, Search, FileText, PlayCircle, Layers, FileQuestion, BookOpen, Clock,
  CheckCircle2, Circle, Filter, ChevronRight
} from "lucide-react";

type ThemeType = "preclinical" | "paraclinical" | "clinical";

interface Subject {
  id: string;
  name: string;
  chapters: number;
  mcqs: number;
  videos: number;
  progress: number;
  theme: ThemeType;
  icon: React.ElementType;
}

const THEMES: Record<ThemeType, { bg: string, text: string, ring: string, badgeBg: string }> = {
  preclinical: { 
    bg: "bg-blue-50 dark:bg-blue-900/30", 
    text: "text-blue-600 dark:text-blue-400",
    ring: "text-blue-500",
    badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
  },
  paraclinical: { 
    bg: "bg-teal-50 dark:bg-teal-900/30", 
    text: "text-teal-600 dark:text-teal-400",
    ring: "text-teal-500",
    badgeBg: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
  },
  clinical: { 
    bg: "bg-green-50 dark:bg-green-900/30", 
    text: "text-green-600 dark:text-green-400",
    ring: "text-green-500",
    badgeBg: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
  },
};

const SUBJECTS: Subject[] = [
  { id: "anatomy", name: "Anatomy", chapters: 32, mcqs: 450, videos: 85, progress: 68, theme: "preclinical", icon: Bone },
  { id: "physiology", name: "Physiology", chapters: 28, mcqs: 380, videos: 72, progress: 45, theme: "preclinical", icon: Activity },
  { id: "biochemistry", name: "Biochemistry", chapters: 24, mcqs: 290, videos: 60, progress: 30, theme: "preclinical", icon: FlaskConical },
  { id: "pathology", name: "Pathology", chapters: 30, mcqs: 420, videos: 90, progress: 52, theme: "paraclinical", icon: Microscope },
  { id: "pharmacology", name: "Pharmacology", chapters: 35, mcqs: 510, videos: 110, progress: 20, theme: "paraclinical", icon: Pill },
  { id: "microbiology", name: "Microbiology", chapters: 26, mcqs: 310, videos: 65, progress: 38, theme: "paraclinical", icon: Bug },
  { id: "forensic", name: "Forensic Medicine", chapters: 18, mcqs: 180, videos: 40, progress: 15, theme: "paraclinical", icon: Scale },
  { id: "community", name: "Community Medicine", chapters: 22, mcqs: 260, videos: 55, progress: 25, theme: "paraclinical", icon: Users },
  { id: "ent", name: "ENT", chapters: 16, mcqs: 200, videos: 45, progress: 10, theme: "clinical", icon: Ear },
  { id: "ophthalmology", name: "Ophthalmology", chapters: 14, mcqs: 175, videos: 38, progress: 8, theme: "clinical", icon: Eye },
  { id: "medicine", name: "General Medicine", chapters: 40, mcqs: 620, videos: 140, progress: 42, theme: "clinical", icon: Stethoscope },
  { id: "surgery", name: "General Surgery", chapters: 38, mcqs: 580, videos: 125, progress: 35, theme: "clinical", icon: Scissors },
  { id: "pediatrics", name: "Pediatrics", chapters: 28, mcqs: 350, videos: 80, progress: 28, theme: "clinical", icon: Baby },
  { id: "obgyn", name: "Obstetrics & Gynecology", chapters: 32, mcqs: 400, videos: 95, progress: 22, theme: "clinical", icon: Users },
  { id: "orthopedics", name: "Orthopedics", chapters: 20, mcqs: 240, videos: 50, progress: 18, theme: "clinical", icon: Bone },
  { id: "dermatology", name: "Dermatology", chapters: 18, mcqs: 220, videos: 45, progress: 12, theme: "clinical", icon: Scan },
  { id: "psychiatry", name: "Psychiatry", chapters: 16, mcqs: 190, videos: 35, progress: 10, theme: "clinical", icon: Brain },
  { id: "radiology", name: "Radiology", chapters: 14, mcqs: 160, videos: 30, progress: 5, theme: "clinical", icon: Radio },
  { id: "anesthesiology", name: "Anesthesiology", chapters: 12, mcqs: 140, videos: 25, progress: 7, theme: "clinical", icon: Syringe },
];

const anatomyChapters = [
  { title: "Osteology", subChapters: 4, time: "2h 30m", progress: 100 },
  { title: "Arthrology", subChapters: 3, time: "1h 45m", progress: 100 },
  { title: "Myology", subChapters: 5, time: "3h 15m", progress: 100 },
  { title: "Cardiovascular System", subChapters: 6, time: "4h 0m", progress: 60 },
  { title: "Lymphatics", subChapters: 2, time: "1h 15m", progress: 0 },
  { title: "Neurology", subChapters: 8, time: "5h 30m", progress: 0 },
  { title: "Head & Neck", subChapters: 12, time: "8h 0m", progress: 0 },
  { title: "Thorax", subChapters: 5, time: "3h 45m", progress: 0 },
  { title: "Abdomen", subChapters: 9, time: "6h 20m", progress: 0 },
  { title: "Pelvis", subChapters: 4, time: "2h 50m", progress: 0 },
];

export function Subjects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Notes");
  
  const selectedSubject = SUBJECTS.find(s => s.id === selectedId);

  return (
    <AppLayout activePage="subjects">
      {selectedSubject ? (
        <SubjectDetail 
          subject={selectedSubject} 
          onBack={() => setSelectedId(null)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ) : (
        <SubjectGrid onSelect={(id) => setSelectedId(id)} />
      )}
    </AppLayout>
  );
}

function SubjectGrid({ onSelect }: { onSelect: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | ThemeType>("all");

  const filtered = SUBJECTS.filter(s => {
    if (filter !== "all" && s.theme !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            MBBS Subjects
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm md:text-base">Browse all 19 subjects and track your progress</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search subjects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-800 dark:text-white shadow-sm transition-all placeholder:text-slate-400"
            />
          </div>
          <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm flex-shrink-0">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-5 px-5 md:mx-0 md:px-0">
        <FilterBadge label="All Subjects" count={19} active={filter === "all"} onClick={() => setFilter("all")} color="blue" />
        <FilterBadge label="Preclinical" count={3} active={filter === "preclinical"} onClick={() => setFilter("preclinical")} color="blue" />
        <FilterBadge label="Paraclinical" count={5} active={filter === "paraclinical"} onClick={() => setFilter("paraclinical")} color="teal" />
        <FilterBadge label="Clinical" count={11} active={filter === "clinical"} onClick={() => setFilter("clinical")} color="green" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filtered.map(subject => {
          const theme = THEMES[subject.theme];
          const Icon = subject.icon;
          
          return (
            <div 
              key={subject.id}
              onClick={() => onSelect(subject.id)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${theme.bg} ${theme.text} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} strokeWidth={1.75} />
                </div>
                <CircularProgress value={subject.progress} colorClass={theme.ring} />
              </div>
              
              <div className="mt-auto relative z-10">
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${theme.text}`}>
                  {subject.theme}
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {subject.name}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-slate-400"/> {subject.chapters} Ch</span>
                  <span className="flex items-center gap-1.5"><FileQuestion size={14} className="text-slate-400"/> {subject.mcqs} MCQs</span>
                  <span className="flex items-center gap-1.5"><PlayCircle size={14} className="text-slate-400"/> {subject.videos} Vids</span>
                </div>
              </div>

              {/* Card gradient effect on hover */}
              <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity pointer-events-none ${theme.bg.split(' ')[0]}`} />
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
            No subjects found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

const TABS = ["Notes", "Videos", "Shorts", "PDFs", "Flashcards", "MCQs", "PYQs", "Bookmarks"];

function SubjectDetail({ subject, onBack, activeTab, setActiveTab }: { subject: Subject, onBack: () => void, activeTab: string, setActiveTab: (t: string) => void }) {
  const theme = THEMES[subject.theme];
  const Icon = subject.icon;

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8 pb-20">
      {/* Back */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors w-fit group"
      >
        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors shadow-sm">
          <ChevronLeft size={16} strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-sm">Back to Subjects</span>
      </button>
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className={`absolute -right-10 -top-20 w-64 h-64 rounded-full opacity-15 dark:opacity-5 blur-3xl pointer-events-none ${theme.bg.split(' ')[0]}`} />

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 lg:gap-6 relative z-10">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 ${theme.bg} ${theme.text}`}>
             <Icon size={40} strokeWidth={1.5} />
          </div>
          <div>
            <div className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${theme.badgeBg}`}>
              {subject.theme}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{subject.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              <span className="flex items-center gap-1.5"><BookOpen size={16} /> {subject.chapters} Chapters</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block"></span>
              <span className="flex items-center gap-1.5"><FileQuestion size={16} /> {subject.mcqs} MCQs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block"></span>
              <span className="flex items-center gap-1.5"><PlayCircle size={16} /> {subject.videos} Videos</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-start gap-4 relative z-10 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5 sm:text-right">Overall Progress</div>
            <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-white sm:text-right">{subject.progress}% Complete</div>
          </div>
          <div className="flex-shrink-0">
            <CircularProgress value={subject.progress} colorClass={theme.ring} />
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-1 border-b border-slate-200 dark:border-slate-700 pb-px -mx-5 px-5 md:mx-0 md:px-0">
        {TABS.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 md:px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors
              ${activeTab === tab 
                ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400" 
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Syllabus Chapters</h2>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{anatomyChapters.length} Chapters</div>
        </div>
        
        {anatomyChapters.map((ch, idx) => {
          const r = 13;
          const circ = 2 * Math.PI * r;
          const offset = circ - (ch.progress / 100) * circ;

          return (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 lg:p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group"
            >
              <div className="flex items-start md:items-center gap-4 lg:gap-5 w-full md:w-auto">
                <div className="mt-1 md:mt-0 flex-shrink-0">
                  {ch.progress === 100 ? (
                    <CheckCircle2 className="text-green-500" size={30} strokeWidth={2.5} />
                  ) : ch.progress > 0 ? (
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 relative flex items-center justify-center">
                      <svg className="w-8 h-8 absolute -rotate-90" viewBox="0 0 28 28">
                          <circle cx="14" cy="14" r={r} fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray={circ} strokeDashoffset={offset} className="text-blue-500" strokeLinecap="round" />
                      </svg>
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    </div>
                  ) : (
                    <Circle className="text-slate-300 dark:text-slate-600" size={30} strokeWidth={2} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                    Chapter {idx + 1}
                    {ch.progress > 0 && ch.progress < 100 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">In Progress</span>
                    )}
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{ch.title}</h3>
                  <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    <span className="flex items-center gap-1.5"><BookOpen size={15} className="text-slate-400 dark:text-slate-500"/> {ch.subChapters} topics</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="flex items-center gap-1.5"><Clock size={15} className="text-slate-400 dark:text-slate-500"/> {ch.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 lg:gap-3 pl-12 md:pl-0 pt-4 md:pt-0 mt-2 md:mt-0 border-t border-slate-100 dark:border-slate-700/50 md:border-t-0 w-full md:w-auto overflow-x-auto hide-scrollbar pb-1 md:pb-0">
                <ResourceIcon tooltip="Notes" active={true} icon={<FileText size={18}/>} />
                <ResourceIcon tooltip="Video" active={idx % 2 === 0 || idx === 3} icon={<PlayCircle size={18}/>} />
                <ResourceIcon tooltip="Flashcards" active={true} icon={<Layers size={18}/>} />
                <ResourceIcon tooltip="MCQs" active={true} icon={<FileQuestion size={18}/>} />
                
                <div className="ml-auto md:ml-2 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CircularProgress({ value, colorClass }: { value: number, colorClass: string }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
        <circle
          className="text-slate-100 dark:text-slate-700/50"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="26"
          cy="26"
        />
        <circle
          className={colorClass}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="26"
          cy="26"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-700 dark:text-slate-200">{value}%</span>
    </div>
  );
}

function FilterBadge({ label, count, active, onClick, color }: { label: string, count: number, active: boolean, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border flex items-center shadow-sm
        ${active 
          ? color === "blue" ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/20" 
            : color === "teal" ? "bg-teal-600 text-white border-teal-600 shadow-teal-500/20"
            : "bg-green-600 text-white border-green-600 shadow-green-500/20"
          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
        }
      `}
    >
      {label} 
      <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
        {count}
      </span>
    </button>
  )
}

function ResourceIcon({ tooltip, active, icon }: { tooltip: string, active: boolean, icon: React.ReactNode }) {
  if (!active) {
    return (
      <div 
        title={`${tooltip} (Not available)`}
        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600 cursor-not-allowed flex-shrink-0"
      >
        {icon}
      </div>
    );
  }
  return (
    <div 
      title={tooltip}
      className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer group flex-shrink-0"
    >
      {icon}
    </div>
  )
}
