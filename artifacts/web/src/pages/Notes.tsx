import { AppLayout } from "../components/layout/AppLayout";

export function Notes() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          Notes
        </h1>

        <div className="grid gap-4">

          <div className="border rounded-xl p-5 hover:shadow-lg cursor-pointer">
            <h2 className="text-xl font-semibold">
              General Anatomy
            </h2>

            <p className="text-gray-500 mt-2">
              15 Chapters
            </p>
          </div>

          <div className="border rounded-xl p-5 hover:shadow-lg cursor-pointer">
            <h2 className="text-xl font-semibold">
              General Physiology
            </h2>

            <p className="text-gray-500 mt-2">
              20 Chapters
            </p>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
