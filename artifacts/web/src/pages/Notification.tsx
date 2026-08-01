import { useState } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";

export function Notifications() {
  const [, navigate] = useLocation();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [quizReminders, setQuizReminders] = useState(true);

  const toggles = [
    { label: "Push Notifications", value: pushEnabled, setter: setPushEnabled },
    { label: "Email Notifications", value: emailEnabled, setter: setEmailEnabled },
    { label: "Quiz Reminders", value: quizReminders, setter: setQuizReminders },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate("/settings")} className="text-blue-600 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        <div className="bg-white rounded-xl shadow-lg divide-y">
          {toggles.map((t, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <span>{t.label}</span>
              <button
                onClick={() => t.setter(!t.value)}
                className={w-12 h-6 rounded-full transition ${
                  t.value ? "bg-blue-600" : "bg-slate-300"
                }}
              >
                <div
                  className={w-5 h-5 bg-white rounded-full shadow transform transition ${
                    t.value ? "translate-x-6" : "translate-x-1"
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
