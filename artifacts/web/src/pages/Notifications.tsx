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
        <button onClick={() => navigate("/settings")} className="text-blue-600 dark:text-blue-400 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Notifications</h1>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg divide-y divide-slate-100 dark:divide-slate-700">
          {toggles.map((t, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <span className="text-slate-700 dark:text-slate-200">{t.label}</span>
              <button
                onClick={() => t.setter(!t.value)}
                className={
                  t.value
                    ? "w-12 h-6 rounded-full transition bg-blue-600"
                    : "w-12 h-6 rounded-full transition bg-slate-300 dark:bg-slate-600"
                }
              >
                <div
                  className={
                    t.value
                      ? "w-5 h-5 bg-white rounded-full shadow transform transition translate-x-6"
                      : "w-5 h-5 bg-white rounded-full shadow transform transition translate-x-1"
                  }
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
