import { useEffect, useState } from "react";
import { FileText, Search, BookOpen } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { pdfsApi, subjectsApi } from "../lib/api";
import type { PdfSummary, SubjectSummary } from "@workspace/api-zod";
import { useSearch } from "wouter";

export function Pdfs() {
  const params = useSearch();
  const [pdfs, setPdfs] = useState<PdfSummary[] | null>(null);
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [search, setSearch] = useState("");

  const urlSubject = new URLSearchParams(params).get("subject") || "all";
  const urlChapter = new URLSearchParams(params).get("chapter");

  useEffect(() => {
    setSubjectFilter(urlSubject);
  }, [urlSubject]);

  useEffect(() => {
    pdfsApi.list().then(setPdfs).catch(() => setPdfs([]));
    subjectsApi.list().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  const filtered = (pdfs ?? []).filter((p) => {
    if (subjectFilter !== "all" && p.subjectId !== subjectFilter) return false;
    if (urlChapter && p.chapterId !== urlChapter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout pageTitle="PDF Library">
      <div className="p-5 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">PDF Library</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm md:text-base">Browse study PDFs across all subjects</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PDFs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-800 dark:text-slate-200 shadow-sm"
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {pdfs === null ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500">Loading PDFs…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 dark:text-slate-500 py-16 bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            No PDFs found. Study material hasn't been added for these subjects yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((pdf) => (
              <a
                key={pdf.id}
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={24} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1.5">
                    <BookOpen size={12} /> {pdf.subjectName}
                  </div>
                  <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {pdf.title}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">{pdf.pageCount} pages</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
