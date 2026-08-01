import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  Bone, Activity, FlaskConical, Microscope, Pill, Bug, Scale, Users, Ear, Eye,
  Stethoscope, Scissors, Baby, Scan, Brain, Radio, Syringe,
  ChevronLeft, Search, FileText, PlayCircle, Layers, FileQuestion, BookOpen, Clock,
  CheckCircle2, Circle, Filter, Bookmark,
} from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { subjectsApi } from "../lib/api";
import type { SubjectSummary, SubjectDetail, ChapterProgress } from "@workspace/api-zod";
import { useLocation } from "wouter";
const ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Bone, Activity, FlaskConical, Microscope, Pill, Bug, Scale, Users, Ear, Eye,
  Stethoscope, Scissors, Baby, Scan, Brain, Radio, Syringe,
};

const THEMES: Record<string, { bg: string; text: string; ring: string; badgeBg: string }> = {
  preclinical: { bg: "bg-blue-50", text: "text-blue-600", ring: "text-blue-500", badgeBg: "bg-blue-100 text-blue-700" },
  paraclinical: { bg: "bg-teal-50", text: "text-teal-600", ring: "text-teal-500", badgeBg: "bg-teal-100 text-teal-700" },
  clinical: { bg: "bg-green-50", text: "text-green-600", ring: "text-green-500", badgeBg: "bg-green-100 text-green-700" },
};

export function Subjects() {
  const [subjects, setSubjects] = useState<SubjectSummary[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    subjectsApi.list().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  return (
    <AppLayout pageTitle="Subjects">
      {selectedId ? (
        <SubjectDetailView subjectId={selectedId} onBack={() => setSelectedId(null)} />
      ) : (
        <SubjectGrid subjects={subjects} onSelect={setSelectedId} />
      )}
    </AppLayout>
  );
}

function SubjectGrid({
  subjects,
  onSelect,
}: {
  subjects: SubjectSummary[] | null;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "preclinical" | "paraclinical" | "clinical">("all");

  if (!subjects) {
    return <div className="p-8 text-center text-slate-400">Loading subjects…</div>;
  }

  const counts = {
    all: subjects.length,
    preclinical: subjects.filter((s) => s.theme === "preclinical").length,
    paraclinical: subjects.filter((s) => s.theme === "paraclinical").length,
    clinical: subjects.filter((s) => s.theme === "clinical").length,
  };

  const filtered = subjects.filter((s) => {
    if (filter !== "all" && s.theme !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">MBBS Subjects</h1>
          <p className="text-slate-500 mt-1.5 text-sm md:text-base">
            Browse all {subjects.length} subjects and track your progress
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-800 shadow-sm transition-all placeholder:text-slate-400"
            />
          </div>
          <button className="p-2.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm flex-shrink-0">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-5 px-5 md:mx-0 md:px-0">
        <FilterBadge label="All Subjects" count={counts.all} active={filter === "all"} onClick={() => setFilter("all")} color="blue" />
        <FilterBadge label="Preclinical" count={counts.preclinical} active={filter === "preclinical"} onClick={() => setFilter("preclinical")} color="blue" />
        <FilterBadge label="Paraclinical" count={counts.paraclinical} active={filter === "paraclinical"} onClick={() => setFilter("paraclinical")} color="teal" />
        <FilterBadge label="Clinical" count={counts.clinical} active={filter === "clinical"} onClick={() => setFilter("clinical")} color="green" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((subject) => {
          const theme = THEMES[subject.theme]!;
          const Icon = ICONS[subject.icon] ?? BookOpen;

          return (
            <div
              key={subject.id}
              onClick={() => onSelect(subject.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${theme.bg} ${theme.text} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} strokeWidth={1.75} />
                </div>
                <CircularProgress value={subject.progressPercent} colorClass={theme.ring} />
              </div>

              <div className="mt-auto relative z-10">
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${theme.text}`}>{subject.theme}</div>
                <h3 className="font-bold text-lg text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">{subject.name}</h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-slate-400" /> {subject.chapterCount} Ch</span>
                  <span className="flex items-center gap-1.5"><FileQuestion size={14} className="text-slate-400" /> {subject.mcqCount} MCQs</span>
                  <span className="flex items-center gap-1.5"><PlayCircle size={14} className="text-slate-400" /> {subject.videoCount} Vids</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">No subjects found matching your search.</div>
        )}
      </div>
    </div>
  );
}

function SubjectDetailView({ subjectId, onBack }: { subjectId: string; onBack: () => void }) {
  const [, navigate] = useLocation();
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [activeTab, setActiveTab] = useState("Notes");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setSubject(null);
    subjectsApi.get(subjectId).then(setSubject).catch(() => setSubject(null));
  }, [subjectId]);

  const handleToggleChapter = async (chapter: ChapterProgress) => {
    const toggleBookmark = (chapterId: string) => {
  setBookmarks((prev) =>
    prev.includes(chapterId)
      ? prev.filter((id) => id !== chapterId)
      : [...prev, chapterId]
  );
};
    if (!subject) return;
    const nextPercent = chapter.progressPercent >= 100 ? 0 : 100;
    const updated = await subjectsApi.setChapterProgress(subjectId, chapter.id, nextPercent);
    setSubject({
      ...subject,
      chapters: subject.chapters.map((c) => (c.id === chapter.id ? { ...c, progressPercent: updated.progressPercent } : c)),
    });
  };

  if (!subject) {
    return (
      <div className="p-5 md:p-8 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6">
          <ChevronLeft size={16} /> Back to Subjects
        </button>
        <div className="text-center text-slate-400 py-12">Loading…</div>
      </div>
    );
  }

  const theme = THEMES[subject.theme]!;
  const Icon = ICONS[subject.icon] ?? BookOpen;
  const TABS = ["Notes", "Videos", "Shorts", "PDFs", "Flashcards", "MCQs", "PYQs", "Bookmarks"];

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors w-fit group">
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-100 transition-colors shadow-sm">
          <ChevronLeft size={16} strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-sm">Back to Subjects</span>
      </button>

      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 lg:gap-6 relative z-10">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 ${theme.bg} ${theme.text}`}>
            <Icon size={40} strokeWidth={1.5} />
          </div>
          <div>
            <div className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${theme.badgeBg}`}>{subject.theme}</div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{subject.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-2 font-medium">
              <span className="flex items-center gap-1.5"><BookOpen size={16} /> {subject.chapterCount} Chapters</span>
              <span className="flex items-center gap-1.5"><FileQuestion size={16} /> {subject.mcqCount} MCQs</span>
              <span className="flex items-center gap-1.5"><PlayCircle size={16} /> {subject.videoCount} Videos</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4 relative z-10 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5 sm:text-right">Overall Progress</div>
            <div className="text-lg md:text-xl font-bold text-slate-900 sm:text-right">{subject.progressPercent}% Complete</div>
          </div>
          <CircularProgress value={subject.progressPercent} colorClass={theme.ring} />
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-1 border-b border-slate-200 pb-px -mx-5 px-5 md:mx-0 md:px-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 md:px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors
              ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-lg font-bold text-slate-800">Syllabus Chapters</h2>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{subject.chapters.length} Chapters</div>
        </div>

        {subject.chapters.length === 0 && (
          <div className="text-center text-slate-400 py-12 bg-white border border-dashed border-slate-200 rounded-2xl">
            Chapter content for {subject.name} hasn't been authored yet.
          </div>
        )}

        {subject.chapters.map((ch, idx) => (
          <div
            key={ch.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
          >
            <div className="flex items-start md:items-center gap-4 lg:gap-5 w-full md:w-auto">
              <button
                onClick={() => handleToggleChapter(ch)}
                className="mt-1 md:mt-0 flex-shrink-0"
                title={ch.progressPercent >= 100 ? "Mark as not done" : "Mark as done"}
              >
                {ch.progressPercent >= 100 ? (
                  <CheckCircle2 className="text-green-500" size={30} strokeWidth={2.5} />
                ) : (
                  <Circle className="text-slate-300 hover:text-blue-400 transition-colors" size={30} strokeWidth={2} />
                )}
              </button>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-blue-600 mb-1.5 uppercase tracking-wider">Chapter {idx + 1}</div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{ch.title}</h3>
                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-slate-500 mt-2 font-medium">
                  <span className="flex items-center gap-1.5"><BookOpen size={15} className="text-slate-400" /> {ch.subChapterCount} topics</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1.5"><Clock size={15} className="text-slate-400" /> {Math.floor(ch.estimatedMinutes / 60)}h {ch.estimatedMinutes % 60}m</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 pl-12 md:pl-0 pt-4 md:pt-0 mt-2 md:mt-0 border-t border-slate-100 md:border-t-0 w-full md:w-auto">
              <div onClick={() => navigate(`/notes?subject=${subject.id}`)}>
  <ResourceIcon
    tooltip="Notes"
    active={true}
    icon={<FileText size={18} />}
  />
</div>
              <ResourceIcon tooltip="Video" active={false} icon={<PlayCircle size={18} />} />
              <ResourceIcon tooltip="Flashcards" active={false} icon={<Layers size={18} />} />
              <ResourceIcon tooltip="MCQs" active={false} icon={<FileQuestion size={18} />} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CircularProgress({ value, colorClass }: { value: number; colorClass: string }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
        <circle className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="transparent" r={radius} cx="26" cy="26" />
        <circle className={colorClass} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="26" cy="26" />
      </svg>
      <span className="absolute text-xs font-bold text-slate-700">{value}%</span>
    </div>
  );
}

function FilterBadge({ label, count, active, onClick, color }: { label: string; count: number; active: boolean; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border flex items-center shadow-sm
        ${active
          ? color === "blue" ? "bg-blue-600 text-white border-blue-600" : color === "teal" ? "bg-teal-600 text-white border-teal-600" : "bg-green-600 text-white border-green-600"
          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
        }
      `}
    >
      {label}
      <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{count}</span>
    </button>
  );
}

function ResourceIcon({ tooltip, active, icon }: { tooltip: string; active: boolean; icon: React.ReactNode }) {
  if (!active) {
    return (
      <div title={`${tooltip} (not available yet)`} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 cursor-not-allowed flex-shrink-0">
        {icon}
      </div>
    );
  }
  return (
    <div title={tooltip} className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex-shrink-0">
      {icon}
    </div>
  );
}
