import { AppLayout } from "../components/layout/AppLayout";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { subjectsApi } from "../lib/api";
import type { SubjectDetail } from "@workspace/api-zod";

export function Notes() {
  const [location] = useLocation();

  const params = new URLSearchParams(location.split("?")[1]);
  const subjectId = params.get("subject");

  const [subject, setSubject] = useState<SubjectDetail | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    subjectsApi
      .get(subjectId)
      .then(setSubject)
      .catch(() => setSubject(null));
  }, [subjectId]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">
          Notes
        </h1>

        <p className="text-gray-500 dark:text-slate-400 mb-6">
          {subject ? subject.name : "Loading..."}
        </p>

        {!subject && (
          <div className="text-center text-gray-500 dark:text-slate-400 py-10">
            Loading...
          </div>
        )}

        {subject && (
          <div className="grid gap-4">

            {subject.chapters.map((chapter, index) => (

              <div
                key={chapter.id}
                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-5 hover:shadow-lg cursor-pointer transition"
              >

                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Chapter {index + 1} : {chapter.title}
                </h2>

                <p className="text-gray-500 dark:text-slate-400 mt-2">
                  {chapter.subChapterCount} Topics
                </p>

                <p className="text-gray-500 dark:text-slate-400">
                  Progress : {chapter.progressPercent}%
                </p>

              </div>

            ))}

          </div>
        )}

      </div>
    </AppLayout>
  );
}
