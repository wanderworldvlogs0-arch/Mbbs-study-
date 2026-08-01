import { useRef, useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";

export function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [academicYear, setAcademicYear] = useState(user?.academicYear || "");
  const [mobile, setMobile] = useState(user?.mobileNumber || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    alert("Photo selected successfully!");
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUser({
        name,
        email,
        academicYear,
        mobileNumber: mobile,
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

    alert("Profile updated successfully!");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          My Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex flex-col items-center">

            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 bg-gray-200 flex items-center justify-center">

              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-gray-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}

            </div>

            <button
              onClick={handlePhotoClick}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Upload Photo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

          </div>

          <div className="mt-8 space-y-5">

            <div>
              <label className="block font-medium mb-1">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Academic Year
              </label>

              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Mobile Number
              </label>

              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              <button
  onClick={handleSave}
  disabled={saving}
  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-lg font-semibold"
>
  {saving ? "Saving…" : "Save Changes"}
</button>
            </button>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}
