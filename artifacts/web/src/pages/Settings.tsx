import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";

export function Settings() {
  const [, navigate] = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  // App load hole localStorage theke dark mode preference check kora
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
      // Backend e logout call (token invalidate korar jonno, jodi lagey)
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // cookie-based session hole
      });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Local token/session clear
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const items = [
    { label: "👤 Edit Profile", action: () => navigate("/profile/edit") },
    { label: darkMode ? "☀️ Light Mode" : "🌙 Dark Mode", action: toggleDarkMode },
    { label: "🔔 Notifications", action: () => navigate("/settings/notifications") },
    { label: "🌐 Language", action: () => navigate("/settings/language") },
    { label: "🔒 Privacy & Security", action: () => navigate("/settings/privacy") },
    { label: "🔑 Change Password", action: () => navigate("/settings/change-password") },
    { label: "💳 Subscription", action: () => navigate("/settings/subscription") },
    { label: "📞 Contact Support", action: () => navigate("/support") },
    { label: "⭐ Rate App", action: () => window.open("https://play.google.com/store", "_blank") },
    { label: "📄 Terms & Conditions", action: () => navigate("/terms") },
    { label: "🔐 Privacy Policy", action: () => navigate("/privacy-policy") },
    { label: "🚪 Logout", action: handleLogout },
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="bg-white rounded-xl shadow-lg">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full text-left px-5 py-4 border-b last:border-b-0 hover:bg-blue-50 transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
