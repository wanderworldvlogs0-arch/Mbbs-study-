export interface PdfSummary {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterId: string | null;
  title: string;
  url: string;
  pageCount: number;
}
