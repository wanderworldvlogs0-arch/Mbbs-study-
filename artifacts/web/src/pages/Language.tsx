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
        <button onClick={() => navigate("/settings")} className="text-blue-600 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Language</h1>

        <div className="bg-white rounded-xl shadow-lg divide-y">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelected(lang)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-blue-50"
            >
              <span>{lang}</span>
              {selected === lang && <span className="text-blue-600">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
