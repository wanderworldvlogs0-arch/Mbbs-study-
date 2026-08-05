-- Migration: Add chapter_id to flashcards table
-- This allows flashcards to be associated with specific chapters

ALTER TABLE flashcards 
ADD COLUMN chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_flashcards_chapter_id ON flashcards(chapter_id);
