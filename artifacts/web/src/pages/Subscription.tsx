import { useLocation } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";

export function Subscription() {
  const [, navigate] = useLocation();

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate("/settings")} className="text-blue-600 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Subscription</h1>

        <div className="bg-white rounded-xl shadow-lg p-5">
          <p className="text-slate-600 mb-2">Current Plan</p>
          <p className="text-xl font-bold mb-4">Free Plan</p>
          <button
            onClick={() => navigate("/coming-soon")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
