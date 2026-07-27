/**
 * Provisional — regenerate with `pnpm --filter @workspace/api-spec run codegen`
 * once dependencies are installed. Matches openapi.yaml subject/dashboard schemas.
 */

export type SubjectTheme = "preclinical" | "paraclinical" | "clinical";

export interface SubjectSummary {
  id: string;
  name: string;
  theme: SubjectTheme;
  icon: string;
  chapterCount: number;
  mcqCount: number;
  videoCount: number;
  progressPercent: number;
}

export interface ChapterProgress {
  id: string;
  title: string;
  orderIndex: number;
  subChapterCount: number;
  estimatedMinutes: number;
  progressPercent: number;
}

export interface SubjectDetail extends SubjectSummary {
  chapters: ChapterProgress[];
}

export interface UpdateProgressRequest {
  progressPercent: number;
}

export interface GoalProgress {
  current: number;
  target: number;
}

export interface DashboardSummary {
  name: string;
  streakDays: boolean[];
  totalStudySeconds: number;
  weekStudySeconds: number;
  todayStudySeconds: number;
  goals: {
    chapters: GoalProgress;
    mcqs: GoalProgress;
    videos: GoalProgress;
  };
}

export interface AddStudyTimeRequest {
  seconds: number;
}

export interface IncrementGoalRequest {
  type: "chapters" | "mcqs" | "videos";
}
