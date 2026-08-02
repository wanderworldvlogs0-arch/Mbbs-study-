import { useState } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";

export function Language() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState("English");

  const languages = ["English", "বাংলা", "हिन्दी"];

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate("/settings")} className="text-blue-600 dark:text-blue-400 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Language</h1>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg divide-y divide-slate-100 dark:divide-slate-700">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelected(lang)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            >
              <span>{lang}</span>
              {selected === lang && <span className="text-blue-600 dark:text-blue-400">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
