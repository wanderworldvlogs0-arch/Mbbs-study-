import { AppLayout } from "../components/layout/AppLayout";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { FileText, ChevronLeft, BookOpen } from "lucide-react";
import { subjectsApi, pdfsApi } from "../lib/api";
import type { SubjectDetail, PdfSummary } from "@workspace/api-zod";

// The generated PdfSummary type doesn't include `category` yet, but the
// API does return it (see artifacts/api-server/src/routes/pdfs.ts).
type PdfWithCategory = PdfSummary & { category?: "notes" | "pyq" };

export function Notes() {
  const [location, navigate] = useLocation();

  const params = new URLSearchParams(location.split("?")[1]);
  const subjectId = params.get("subject");
  const chapterId = params.get("chapter");

  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [notes, setNotes] = useState<PdfWithCategory[] | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    subjectsApi
      .get(subjectId)
      .then(setSubject)
      .catch(() => setSubject(null));

    pdfsApi
      .list(subjectId, chapterId ?? undefined)
      .then((all) => setNotes((all as PdfWithCategory[]).filter((p) => p.category !== "pyq")))
      .catch(() => setNotes([]));
  }, [subjectId, chapterId]);

  const chapter = subject?.chapters.find((c) => c.id === chapterId) ?? null;
  const chapterIndex = subject?.chapters.findIndex((c) => c.id === chapterId) ?? -1;

  if (!subjectId || !chapterId) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">Notes</h1>
          <div className="text-center text-gray-500 dark:text-slate-400 py-16 bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl mt-6">
            Pick a chapter from the Subjects page to view its notes.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6">

        <button
          onClick={() => navigate("/subjects")}
          className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-4"
        >
          <ChevronLeft size={16} /> Back to Subjects
        </button>

        <h1 className="text-3xl font-bold mb-1 text-slate-900 dark:text-slate-100">
          Notes
        </h1>

        <p className="text-gray-500 dark:text-slate-400 mb-6 flex items-center gap-1.5">
          <BookOpen size={14} className="text-slate-400 dark:text-slate-500" />
          {subject ? subject.name : "Loading..."}
          {chapter && (
            <span> &middot; Chapter {chapterIndex + 1}: {chapter.title}</span>
          )}
        </p>

        {(!subject || notes === null) && (
          <div className="text-center text-gray-500 dark:text-slate-400 py-10">
            Loading...
          </div>
        )}

        {subject && notes !== null && notes.length === 0 && (
          <div className="text-center text-slate-400 dark:text-slate-500 py-16 bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            No notes have been added for this chapter yet.
          </div>
        )}

        {subject && notes !== null && notes.length > 0 && (
          <div className="grid gap-4">
            {notes.map((note) => (
              <a
                key={note.id}
                href={note.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-5 hover:shadow-lg transition flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {note.title}
                  </h2>
                  <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">
                    {note.pageCount} pages
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
