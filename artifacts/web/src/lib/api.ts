import type {
  AuthUser,
  ErrorResponse,
  SubjectSummary,
  SubjectDetail,
  ChapterProgress,
  DashboardSummary,
  VideoSummary,
  PdfSummary,
} from "@workspace/api-zod";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ErrorResponse | null;
    throw new ApiError(res.status, body?.message ?? "Something went wrong");
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const authApi = {
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    academicYear?: string;
  }) =>
    request<AuthUser>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  signIn: (data: { email: string; password: string }) =>
    request<AuthUser>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => request<void>("/auth/logout", { method: "POST" }),

  me: () => request<AuthUser>("/auth/me"),
};

export const subjectsApi = {
  list: () => request<SubjectSummary[]>("/subjects"),
  get: (subjectId: string) => request<SubjectDetail>(`/subjects/${subjectId}`),
  setChapterProgress: (
    subjectId: string,
    chapterId: string,
    progressPercent: number,
  ) =>
    request<ChapterProgress>(
      `/subjects/${subjectId}/chapters/${chapterId}/progress`,
      { method: "PUT", body: JSON.stringify({ progressPercent }) },
    ),
};

export const dashboardApi = {
  summary: () => request<DashboardSummary>("/dashboard/summary"),
  addStudyTime: (seconds: number) =>
    request<DashboardSummary>("/dashboard/study-time", {
      method: "POST",
      body: JSON.stringify({ seconds }),
    }),
  incrementGoal: (type: "chapters" | "mcqs" | "videos") =>
    request<DashboardSummary>("/dashboard/goals/increment", {
      method: "POST",
      body: JSON.stringify({ type }),
    }),
};
import type {
  AuthUser,
  ErrorResponse,
  SubjectSummary,
  SubjectDetail,
  ChapterProgress,
  DashboardSummary,
  VideoSummary,
  PdfSummary,
} from "@workspace/api-zod";
export const videosApi = {
  list: (subjectId?: string) =>
    request<VideoSummary[]>(subjectId ? `/videos?subjectId=${subjectId}` : "/videos"),
};

export const pdfsApi = {
  list: (subjectId?: string) =>
    request<PdfSummary[]>(subjectId ? `/pdfs?subjectId=${subjectId}` : "/pdfs"),
};
