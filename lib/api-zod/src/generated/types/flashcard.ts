export interface FlashcardSubjectOption {
  id: string;
  name: string;
  totalCards: number;
  dueCount: number;
  masteryPercent: number;
}

export interface FlashcardCard {
  id: string;
  front: string;
  back: string;
  mnemonic: string | null;
  reference: string | null;
}

export interface FlashcardSession {
  subjectId: string | null;
  subjectName: string;
  cards: FlashcardCard[];
}

export type FlashcardRating = "again" | "hard" | "good" | "easy";

export interface RateFlashcardRequest {
  flashcardId: string;
  rating: FlashcardRating;
}
