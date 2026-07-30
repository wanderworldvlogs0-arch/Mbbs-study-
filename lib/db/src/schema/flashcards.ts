import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { subjectsTable } from "./subjects";

export const flashcardsTable = pgTable("flashcards", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjectsTable.id, { onDelete: "cascade" }),
  front: text("front").notNull(),
  back: text("back").notNull(),
  mnemonic: text("mnemonic"),
  reference: text("reference"),
  orderIndex: integer("order_index").notNull().default(0),
});

export type Flashcard = typeof flashcardsTable.$inferSelect;
