import { AppLayout } from "../components/layout/AppLayout";

export function Settings() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="bg-white rounded-xl shadow p-5 space-y-4">

          <div className="flex justify-between items-center">
            <span>Dark Mode</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Coming Soon
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span>Notifications</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Coming Soon
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span>Language</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              English
            </button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
