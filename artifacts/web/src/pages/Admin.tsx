import { useEffect, useState } from "react";
import {
  UploadCloud,
  Video,
  FileText,
  ScrollText,
  Layers,
  Brain,
  Trash2,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { subjectsApi, adminApi, ApiError } from "../lib/api";
import type { SubjectSummary } from "@workspace/api-zod";
import type { AdminContent } from "../lib/api";
import { uploadToCloudinary } from "../lib/cloudinary";

type ContentType = "video" | "notes" | "pyq" | "flashcard" | "mcq";

const TABS: { id: ContentType; label: string; icon: typeof Video }[] = [
  { id: "video", label: "Video", icon: Video },
  { id: "notes", label: "PDF Notes", icon: FileText },
  { id: "pyq", label: "PYQ", icon: ScrollText },
  { id: "flashcard", label: "Flashcard", icon: Layers },
  { id: "mcq", label: "MCQ", icon: Brain },
];

export function Admin() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [tab, setTab] = useState<ContentType>("video");
  const [content, setContent] = useState<AdminContent | null>(null);

  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .check()
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false))
      .finally(() => setChecking(false));
    subjectsApi.list().then((subs) => {
      setSubjects(subs);
      if (subs[0]) setSubjectId(subs[0].id);
    });
  }, []);

  useEffect(() => {
    if (subjectId && isAdmin) {
      adminApi.content(subjectId).then(setContent).catch(() => setContent(null));
    }
  }, [subjectId, isAdmin]);

  function refresh() {
    if (subjectId) adminApi.content(subjectId).then(setContent).catch(() => {});
  }

  if (checking) {
    return (
      <AppLayout pageTitle="Admin Panel">
        <div className="p-8 text-center text-slate-400">Checking access…</div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AppLayout pageTitle="Admin Panel">
        <div className="p-8 max-w-lg mx-auto text-center">
          <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Admin access required
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            This account isn't on the admin list. Ask whoever manages the app to add your
            sign-in email to the <code>ADMIN_EMAILS</code> setting on Render.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Admin Panel">
      <div className="p-5 md:p-8 max-w-5xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Admin Panel
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm md:text-base">
            Upload videos, PDFs, PYQs, flashcards and MCQs for students
          </p>
        </div>

        {/* Subject picker */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:w-72"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content type tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setStatus(null);
                }}
                className={
                  active
                    ? "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm"
                    : "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {status && (
          <div
            className={
              status.type === "ok"
                ? "px-4 py-2.5 rounded-xl text-sm bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "px-4 py-2.5 rounded-xl text-sm bg-red-50 text-red-700 border border-red-200"
            }
          >
            {status.text}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-6">
          {tab === "video" && (
            <VideoForm
              subjectId={subjectId}
              saving={saving}
              setSaving={setSaving}
              setStatus={setStatus}
              onDone={refresh}
            />
          )}
          {tab === "notes" && (
            <PdfForm
              subjectId={subjectId}
              category="notes"
              saving={saving}
              setSaving={setSaving}
              setStatus={setStatus}
              onDone={refresh}
            />
          )}
          {tab === "pyq" && (
            <PdfForm
              subjectId={subjectId}
              category="pyq"
              saving={saving}
              setSaving={setSaving}
              setStatus={setStatus}
              onDone={refresh}
            />
          )}
          {tab === "flashcard" && (
            <FlashcardForm
              subjectId={subjectId}
              saving={saving}
              setSaving={setSaving}
              setStatus={setStatus}
              onDone={refresh}
            />
          )}
          {tab === "mcq" && (
            <McqForm
              subjectId={subjectId}
              saving={saving}
              setSaving={setSaving}
              setStatus={setStatus}
              onDone={refresh}
            />
          )}
        </div>

        {/* Existing content list */}
        {content && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">
              Already uploaded
            </h2>
            <ExistingList tab={tab} content={content} onDeleted={refresh} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// ---------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------

type Setter = (s: { type: "ok" | "err"; text: string } | null) => void;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
      {children}
    </label>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

function FileUploadField({
  label,
  accept,
  url,
  setUrl,
}: {
  label: string;
  accept: string;
  url: string;
  setUrl: (u: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setProgress(0);
    setError("");
    try {
      const uploadedUrl = await uploadToCloudinary(file, setProgress);
      setUrl(uploadedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 justify-center px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:border-blue-400 hover:text-blue-600">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading… {progress}%
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" /> Choose a file from your device
            </>
          )}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <FieldLabel>Or paste a link (YouTube, Google Drive, etc.)</FieldLabel>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Video form
// ---------------------------------------------------------------

function VideoForm({
  subjectId,
  saving,
  setSaving,
  setStatus,
  onDone,
}: {
  subjectId: string;
  saving: boolean;
  setSaving: (b: boolean) => void;
  setStatus: Setter;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  async function submit() {
    if (!subjectId || !title || !url) {
      setStatus({ type: "err", text: "Title and a video link/file are required." });
      return;
    }
    setSaving(true);
    try {
      await adminApi.addVideo({
        subjectId,
        title,
        url,
        durationMinutes: durationMinutes ? Number(durationMinutes) : 0,
      });
      setTitle("");
      setUrl("");
      setDurationMinutes("");
      setStatus({ type: "ok", text: "Video added." });
      onDone();
    } catch (err) {
      setStatus({ type: "err", text: err instanceof ApiError ? err.message : "Failed to save." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Title</FieldLabel>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Cardiovascular System – Lecture 1" />
      </div>
      <FileUploadField label="Video file" accept="video/*" url={url} setUrl={setUrl} />
      <div className="max-w-xs">
        <FieldLabel>Duration (minutes, optional)</FieldLabel>
        <input value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className={inputClass} placeholder="45" inputMode="numeric" />
      </div>
      <button
        onClick={submit}
        disabled={saving}
        className="self-start px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm disabled:opacity-50"
      >
        {saving ? "Saving…" : "Add video"}
      </button>
      <p className="text-xs text-slate-400">
        Tip: large lecture videos work best on YouTube (unlisted) — paste that link instead of uploading the raw file, it's free and faster for students to stream.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------
// PDF / PYQ form
// ---------------------------------------------------------------

function PdfForm({
  subjectId,
  category,
  saving,
  setSaving,
  setStatus,
  onDone,
}: {
  subjectId: string;
  category: "notes" | "pyq";
  saving: boolean;
  setSaving: (b: boolean) => void;
  setStatus: Setter;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [year, setYear] = useState("");

  async function submit() {
    if (!subjectId || !title || !url) {
      setStatus({ type: "err", text: "Title and a PDF link/file are required." });
      return;
    }
    setSaving(true);
    try {
      await adminApi.addPdf({
        subjectId,
        title,
        url,
        pageCount: pageCount ? Number(pageCount) : 0,
        category,
        year: category === "pyq" ? year : undefined,
      });
      setTitle("");
      setUrl("");
      setPageCount("");
      setYear("");
      setStatus({ type: "ok", text: category === "pyq" ? "PYQ added." : "PDF added." });
      onDone();
    } catch (err) {
      setStatus({ type: "err", text: err instanceof ApiError ? err.message : "Failed to save." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Title</FieldLabel>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder={category === "pyq" ? "e.g. Anatomy PYQ 2023" : "e.g. Osteology Notes"}
        />
      </div>
      <FileUploadField label="PDF file" accept="application/pdf" url={url} setUrl={setUrl} />
      <div className="flex gap-4 flex-wrap">
        {category === "pyq" && (
          <div className="max-w-xs">
            <FieldLabel>Year</FieldLabel>
            <input value={year} onChange={(e) => setYear(e.target.value)} className={inputClass} placeholder="2023" />
          </div>
        )}
        <div className="max-w-xs">
          <FieldLabel>Page count (optional)</FieldLabel>
          <input value={pageCount} onChange={(e) => setPageCount(e.target.value)} className={inputClass} placeholder="24" inputMode="numeric" />
        </div>
      </div>
      <button
        onClick={submit}
        disabled={saving}
        className="self-start px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm disabled:opacity-50"
      >
        {saving ? "Saving…" : category === "pyq" ? "Add PYQ" : "Add PDF"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------
// Flashcard form
// ---------------------------------------------------------------

function FlashcardForm({
  subjectId,
  saving,
  setSaving,
  setStatus,
  onDone,
}: {
  subjectId: string;
  saving: boolean;
  setSaving: (b: boolean) => void;
  setStatus: Setter;
  onDone: () => void;
}) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [reference, setReference] = useState("");

  async function submit() {
    if (!subjectId || !front || !back) {
      setStatus({ type: "err", text: "Front and back text are required." });
      return;
    }
    setSaving(true);
    try {
      await adminApi.addFlashcard({ subjectId, front, back, mnemonic, reference });
      setFront("");
      setBack("");
      setMnemonic("");
      setReference("");
      setStatus({ type: "ok", text: "Flashcard added." });
      onDone();
    } catch (err) {
      setStatus({ type: "err", text: err instanceof ApiError ? err.message : "Failed to save." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Front (question)</FieldLabel>
        <textarea value={front} onChange={(e) => setFront(e.target.value)} rows={2} className={inputClass} />
      </div>
      <div>
        <FieldLabel>Back (answer)</FieldLabel>
        <textarea value={back} onChange={(e) => setBack(e.target.value)} rows={2} className={inputClass} />
      </div>
      <div>
        <FieldLabel>Mnemonic (optional)</FieldLabel>
        <input value={mnemonic} onChange={(e) => setMnemonic(e.target.value)} className={inputClass} />
      </div>
      <div>
        <FieldLabel>Reference (optional)</FieldLabel>
        <input value={reference} onChange={(e) => setReference(e.target.value)} className={inputClass} placeholder="e.g. Gray's Anatomy Ch.4" />
      </div>
      <button
        onClick={submit}
        disabled={saving}
        className="self-start px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm disabled:opacity-50"
      >
        {saving ? "Saving…" : "Add flashcard"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------
// MCQ form
// ---------------------------------------------------------------

function McqForm({
  subjectId,
  saving,
  setSaving,
  setStatus,
  onDone,
}: {
  subjectId: string;
  saving: boolean;
  setSaving: (b: boolean) => void;
  setStatus: Setter;
  onDone: () => void;
}) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");

  async function submit() {
    const filled = options.filter((o) => o.trim());
    if (!subjectId || !questionText || filled.length < 2) {
      setStatus({ type: "err", text: "Question text and at least 2 options are required." });
      return;
    }
    setSaving(true);
    try {
      const ids = ["A", "B", "C", "D"];
      const opts = options
        .map((text, i) => ({ id: ids[i]!, text }))
        .filter((o) => o.text.trim());
      await adminApi.addMcq({
        subjectId,
        questionText,
        options: opts,
        correctOptionId: ids[correctIndex]!,
        explanation,
      });
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(0);
      setExplanation("");
      setStatus({ type: "ok", text: "MCQ added." });
      onDone();
    } catch (err) {
      setStatus({ type: "err", text: err instanceof ApiError ? err.message : "Failed to save." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Question</FieldLabel>
        <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} rows={2} className={inputClass} />
      </div>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-3">
          <input
            type="radio"
            name="correct"
            checked={correctIndex === i}
            onChange={() => setCorrectIndex(i)}
            className="w-4 h-4 accent-blue-600"
            title="Mark as correct answer"
          />
          <input
            value={opt}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              setOptions(next);
            }}
            className={inputClass}
            placeholder={`Option ${String.fromCharCode(65 + i)}`}
          />
        </div>
      ))}
      <p className="text-xs text-slate-400 -mt-2">Select the radio button next to the correct option.</p>
      <div>
        <FieldLabel>Explanation (optional)</FieldLabel>
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} className={inputClass} />
      </div>
      <button
        onClick={submit}
        disabled={saving}
        className="self-start px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm disabled:opacity-50"
      >
        {saving ? "Saving…" : "Add MCQ"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------
// Existing content list (with delete)
// ---------------------------------------------------------------

function ExistingList({
  tab,
  content,
  onDeleted,
}: {
  tab: ContentType;
  content: AdminContent;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function remove(kind: ContentType, id: string) {
    setDeleting(id);
    try {
      if (kind === "video") await adminApi.deleteVideo(id);
      else if (kind === "notes" || kind === "pyq") await adminApi.deletePdf(id);
      else if (kind === "flashcard") await adminApi.deleteFlashcard(id);
      else if (kind === "mcq") await adminApi.deleteMcq(id);
      onDeleted();
    } finally {
      setDeleting(null);
    }
  }

  const rowClass =
    "flex items-center justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0 text-sm";

  if (tab === "video") {
    if (content.videos.length === 0) return <Empty />;
    return (
      <>
        {content.videos.map((v) => (
          <div key={v.id} className={rowClass}>
            <span className="text-slate-700 dark:text-slate-300 truncate">{v.title}</span>
            <DeleteBtn onClick={() => remove("video", v.id)} loading={deleting === v.id} />
          </div>
        ))}
      </>
    );
  }

  if (tab === "notes" || tab === "pyq") {
    const rows = content.pdfs.filter((p) => p.category === tab);
    if (rows.length === 0) return <Empty />;
    return (
      <>
        {rows.map((p) => (
          <div key={p.id} className={rowClass}>
            <span className="text-slate-700 dark:text-slate-300 truncate">
              {p.title}
              {p.year ? ` (${p.year})` : ""}
            </span>
            <DeleteBtn onClick={() => remove(tab, p.id)} loading={deleting === p.id} />
          </div>
        ))}
      </>
    );
  }

  if (tab === "flashcard") {
    if (content.flashcards.length === 0) return <Empty />;
    return (
      <>
        {content.flashcards.map((f) => (
          <div key={f.id} className={rowClass}>
            <span className="text-slate-700 dark:text-slate-300 truncate">{f.front}</span>
            <DeleteBtn onClick={() => remove("flashcard", f.id)} loading={deleting === f.id} />
          </div>
        ))}
      </>
    );
  }

  if (content.mcqs.length === 0) return <Empty />;
  return (
    <>
      {content.mcqs.map((m) => (
        <div key={m.id} className={rowClass}>
          <span className="text-slate-700 dark:text-slate-300 truncate">{m.questionText}</span>
          <DeleteBtn onClick={() => remove("mcq", m.id)} loading={deleting === m.id} />
        </div>
      ))}
    </>
  );
}

function Empty() {
  return <p className="text-sm text-slate-400 py-4 text-center">Nothing uploaded here yet.</p>;
}

function DeleteBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
