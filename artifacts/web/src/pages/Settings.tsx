import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";
import { useTheme } from "../context/ThemeContext";

export function Settings() {
  const [, navigate] = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout API error:", err);
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
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Settings</h1>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full text-left px-5 py-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
