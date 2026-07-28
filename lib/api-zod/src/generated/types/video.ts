export interface VideoSummary {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterId: string | null;
  title: string;
  url: string;
  durationMinutes: number;
}
