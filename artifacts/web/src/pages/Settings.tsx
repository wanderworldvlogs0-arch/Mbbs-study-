import { AppLayout } from "../components/layout/AppLayout";

export function Settings() {
  const items = [
    "👤 Edit Profile",
    "🌙 Dark Mode",
    "🔔 Notifications",
    "🌐 Language",
    "🔒 Privacy & Security",
    "🔑 Change Password",
    "💳 Subscription",
    "📞 Contact Support",
    "⭐ Rate App",
    "📄 Terms & Conditions",
    "🔐 Privacy Policy",
    "🚪 Logout",
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="bg-white rounded-xl shadow-lg">
          {items.map((item, index) => (
            <button
              key={index}
              className="w-full text-left px-5 py-4 border-b last:border-b-0 hover:bg-blue-50 transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
