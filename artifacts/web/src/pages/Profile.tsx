import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";

export function Profile() {
  const { user } = useAuth();
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
