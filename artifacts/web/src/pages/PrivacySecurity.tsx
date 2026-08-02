import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";

export function PrivacySecurity() {
  const [, navigate] = useLocation();

  const options = [
    "Two-Factor Authentication",
    "Login Activity",
    "Blocked Accounts",
    "Data & Permissions",
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate("/settings")} className="text-blue-600 dark:text-blue-400 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Privacy & Security</h1>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg divide-y divide-slate-100 dark:divide-slate-700">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => navigate("/coming-soon")}
              className="w-full text-left px-5 py-4 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
