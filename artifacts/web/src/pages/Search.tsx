import { AppLayout } from "../components/layout/AppLayout";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchPage() {
  const [query, setQuery] = useState("");

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

        <div className="mt-8 text-gray-500 text-center">

          {query === ""
            ? "Start typing to search..."
            : `Searching for "${query}"`}

        </div>

      </div>
    </AppLayout>
  );
}
