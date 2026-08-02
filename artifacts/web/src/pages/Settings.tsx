import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";

export function Settings() {
  const [, navigate] = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("darkMode", String(newValue));
    document.documentElement.classList.toggle("dark", newValue);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      localStorage.removeItem("token");
      navigate("/signin");
    }
  };

  const items = [
    { label: "👤 Edit Profile", action: () => navigate("/profile") },
    { label: darkMode ? "☀️ Light Mode" : "🌙 Dark Mode", action: toggleDarkMode },
    { label: "🔔 Notifications", action: () => navigate("/notifications") },
    { label: "🌐 Language", action: () => navigate("/language") },
    { label: "🔒 Privacy & Security", action: () => navigate("/privacy-security") },
    { label: "🔑 Change Password", action: () => navigate("/change-password") },
    { label: "💳 Subscription", action: () => navigate("/subscription") },
    { label: "📞 Contact Support", action: () => navigate("/support") },
    { label: "⭐ Rate App", action: () => window.open("https://play.google.com/store", "_blank") },
    { label: "📄 Terms & Conditions", action: () => navigate("/terms") },
    { label: "🔐 Privacy Policy", action: () => navigate("/privacy-policy") },
    { label: "🚪 Logout", action: handleLogout },
  ];

  return (
    <AppLayout>
      <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
          Settings
        </h1>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full text-left px-5 py-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 text-slate-800 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
