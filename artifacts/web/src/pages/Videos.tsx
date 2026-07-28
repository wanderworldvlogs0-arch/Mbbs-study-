import { useEffect, useState } from "react";
import { PlayCircle, Search, Clock, BookOpen } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { videosApi, subjectsApi } from "../lib/api";
import type { VideoSummary, SubjectSummary } from "@workspace/api-zod";

export function Videos() {
  const [videos, setVideos] = useState<VideoSummary[] | null>(null);
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    videosApi.list().then(setVideos).catch(() => setVideos([]));
    subjectsApi.list().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  const filtered = (videos ?? []).filter((v) => {
    if (subjectFilter !== "all" && v.subjectId !== subjectFilter) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout pageTitle="Video Learning">
      <div className="p-5 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Video Learning</h1>
          <p className="text-slate-500 mt-1.5 text-sm md:text-base">Browse video lessons across all subjects</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-800 shadow-sm"
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {videos === null ? (
          <div className="p-8 text-center text-slate-400">Loading videos…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
            No videos found. Video lessons haven't been added for these subjects yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle size={24} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1.5 flex items-center gap-1.5">
                    <BookOpen size={12} /> {video.subjectName}
                  </div>
                  <h3 className="font-bold text-base text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-2">
                    <Clock size={14} className="text-slate-400" /> {video.durationMinutes} min
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
