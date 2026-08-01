import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";

export function ContactSupport() {
  const [, navigate] = useLocation();

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate("/settings")} className="text-blue-600 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Contact Support</h1>

        <div className="bg-white rounded-xl shadow-lg p-5 space-y-4">
          <p className="text-slate-600">
            Kono shomossha hole amader shathe jogajog koro:
          </p>
          <a
            href="mailto:support@medmasterai.com"
            className="block text-blue-600 font-medium"
          >
            📧 support@medmasterai.com
          </a>
          <a
            href="https://wa.me/8801XXXXXXXXX"
            target="_blank"
            className="block text-blue-600 font-medium"
          >
            💬 WhatsApp e message koro
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
