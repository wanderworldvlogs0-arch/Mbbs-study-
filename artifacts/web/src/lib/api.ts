import type {
  AuthUser,
  ErrorResponse,
  SubjectSummary,
  SubjectDetail,
  ChapterProgress,
  DashboardSummary,
  VideoSummary,
  PdfSummary,
  QuizSubjectOption,
  QuizAttemptstart,
  Quizresult,
  RecentQuizSummary,
  LeaderboardEntry,
  FlashcardSubjectOption,
  FlashcardSession,
  FlashcardRating,
  DoubtChatSummary,
  DoubtChatDetail,
  SendDoubtMessageResponse,
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
    const rawText = await res.text().catch(() => "");
    let message = `HTTP ${res.status}`;
    try {
      const body = JSON.parse(rawText) as ErrorResponse;
      message = body?.message ?? message;
    } catch {
      message = `HTTP ${res.status}: ${rawText.slice(0, 200)}`;
    }
    throw new ApiError(res.status, message);
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
export const quizApi = {
  subjects: () => request<QuizSubjectOption[]>("/quiz/subjects"),
  start: (subjectId: string, count?: number) =>
    request<QuizAttemptStart>("/quiz/start", {
      method: "POST",
      body: JSON.stringify({ subjectId, count }),
    }),
  saveAnswer: (attemptId: string, mcqId: string, selectedOptionId: string | null) =>
    request<{ ok: boolean }>(`/quiz/${attemptId}/answer`, {
      method: "PUT",
      body: JSON.stringify({ mcqId, selectedOptionId }),
    }),
  submit: (attemptId: string) =>
    request<QuizResult>(`/quiz/${attemptId}/submit`, { method: "POST" }),
  recent: () => request<RecentQuizSummary[]>("/quiz/recent"),
  leaderboard: () => request<LeaderboardEntry[]>("/quiz/leaderboard"),
};
export const flashcardsApi = {
  subjects: () => request<FlashcardSubjectOption[]>("/flashcards/subjects"),
  session: (subjectId?: string) =>
    request<FlashcardSession>(
      subjectId ? `/flashcards/session?subjectId=${subjectId}` : "/flashcards/session",
    ),
  rate: (flashcardId: string, rating: FlashcardRating) =>
    request<{ ok: boolean }>(`/flashcards/${flashcardId}/rate`, {
      method: "PUT",
      body: JSON.stringify({ rating }),
    }),
};
export const doubtSolverApi = {
  chats: () => request<DoubtChatSummary[]>("/doubt-solver/chats"),
  chat: (chatId: string) => request<DoubtChatDetail>(`/doubt-solver/chats/${chatId}`),
  send: (chatId: string | null, message: string) =>
    request<SendDoubtMessageResponse>("/doubt-solver/send", {
      method: "POST",
      body: JSON.stringify({ chatId, message }),
    }),
};
