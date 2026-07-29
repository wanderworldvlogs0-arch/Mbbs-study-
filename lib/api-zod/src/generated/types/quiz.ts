export interface QuizSubjectOption {
  id: string;
  name: string;
  theme: string;
  icon: string;
  mcqCount: number;
}

export interface QuizQuestion {
  mcqId: string;
  questionText: string;
  options: { id: string; text: string }[];
}

export interface QuizAttemptStart {
  attemptId: string;
  subjectId: string;
  subjectName: string;
  questions: QuizQuestion[];
}

export interface SubmitAnswerRequest {
  mcqId: string;
  selectedOptionId: string | null;
}

export interface QuizAnswerReview {
  mcqId: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  explanation: string | null;
}

export interface QuizResult {
  attemptId: string;
  subjectName: string;
  totalQuestions: number;
  correctCount: number;
  accuracyPercent: number;
  passed: boolean;
  answers: QuizAnswerReview[];
}

export interface RecentQuizSummary {
  attemptId: string;
  subjectName: string;
  correctCount: number;
  totalQuestions: number;
  accuracyPercent: number;
  passed: boolean;
  submittedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  totalCorrect: number;
  isUser: boolean;
}
