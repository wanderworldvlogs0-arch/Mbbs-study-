import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";

export function Terms() {
  const [, navigate] = useLocation();

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/settings")}
          className="text-blue-600 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
        <div className="text-slate-600 space-y-3 leading-relaxed">
          <p>
            Welcome to MedMaster AI. By using this app, you agree to use
            the content (notes, videos, quizzes, flashcards) for personal
            study purposes only.
          </p>
          <p>
            Redistribution or resale of app content without permission is
            not allowed. We may update these terms from time to time.
          </p>
          <p>
            For any questions regarding these terms, please contact support
            through the app.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
