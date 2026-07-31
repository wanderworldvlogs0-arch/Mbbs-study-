import { AppLayout } from "../components/layout/AppLayout";
import { Search } from "lucide-react";
import { useState } from "react";

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

        <h1 className="text-3xl font-bold mb-6">
          Search
        </h1>

        <div className="relative">

          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search subjects, videos, PDFs, quizzes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-xl py-3 pl-12 pr-4"
          />

        </div>

        <div className="mt-8 space-y-3">

  {query === "" ? (
    <p className="text-center text-gray-500">
      Start typing to search...
    </p>
  ) : (
    items
      .filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
      .map((item, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 hover:bg-gray-100 cursor-pointer"
        >
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.type}</p>
        </div>
      ))
  )}

</div>

      </div>
    </AppLayout>
  );
}
