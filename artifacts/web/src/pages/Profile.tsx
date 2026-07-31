import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";

export function Profile() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user?.name || ""}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={user?.email || ""}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Academic Year
            </label>
            <input
              type="text"
              defaultValue={user?.academicYear || ""}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="Enter mobile number"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
