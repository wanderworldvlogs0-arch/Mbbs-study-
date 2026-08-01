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
        <button onClick={() => navigate("/settings")} className="text-blue-600 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Privacy & Security</h1>

        <div className="bg-white rounded-xl shadow-lg divide-y">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => navigate("/coming-soon")}
              className="w-full text-left px-5 py-4 hover:bg-blue-50"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
