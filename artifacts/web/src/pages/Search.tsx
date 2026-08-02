import { AppLayout } from "../components/layout/AppLayout";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const items = [
  { title: "General Anatomy", type: "Subject", link: "/subjects" },
  { title: "Upper Limb", type: "Subject", link: "/subjects" },
  { title: "Thorax", type: "Subject", link: "/subjects" },

  { title: "Cell Injury", type: "PDF", link: "/pdfs" },
  { title: "Inflammation", type: "PDF", link: "/pdfs" },

  { title: "Heart Physiology", type: "Video", link: "/videos" },
  { title: "ECG Basics", type: "Video", link: "/videos" },

  { title: "Pharmacology Quiz", type: "Quiz", link: "/quiz" },
];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Search
        </h1>

        <div className="relative">

          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />

          <input
            type="text"
            placeholder="Search subjects, videos, PDFs, quizzes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl py-3 pl-12 pr-4"
          />

        </div>

        <div className="mt-8 space-y-3">

  {query === "" ? (
    <p className="text-center text-gray-500 dark:text-slate-400">
      Start typing to search...
    </p>
  ) : (
    items
      .filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
      .map((item, index) => (
        <Link key={index} href={item.link}>
  <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-600 cursor-pointer transition">
    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
    <p className="text-sm text-gray-500 dark:text-slate-400">{item.type}</p>
  </div>
</Link>
        
      ))
  )}

</div>

      </div>
    </AppLayout>
  );
}
