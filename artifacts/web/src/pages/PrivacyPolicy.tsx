import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";

export function PrivacyPolicy() {
  const [, navigate] = useLocation();

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/settings")}
          className="text-blue-600 dark:text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Privacy Policy</h1>
        <div className="text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
          <p>
            We collect basic account information (name, email) to provide
            you with app services like progress tracking and personalized
            content.
          </p>
          <p>
            Your data is not sold to third parties. We use it only to
            improve your learning experience within the app.
          </p>
          <p>
            You can request account deletion or data removal by contacting
            support.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
