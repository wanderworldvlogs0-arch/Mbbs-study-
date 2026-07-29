import { pgTable, text, integer, uuid, jsonb } from "drizzle-orm/pg-core";
import { subjectsTable } from "./subjects";
import { chaptersTable } from "./chapters";

export interface McqOption {
  id: string; // "A" | "B" | "C" | "D"
  text: string;
}

export const mcqsTable = pgTable("mcqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjectsTable.id, { onDelete: "cascade" }),
  chapterId: uuid("chapter_id").references(() => chaptersTable.id, {
    onDelete: "set null",
  }),
  questionText: text("question_text").notNull(),
  options: jsonb("options").$type<McqOption[]>().notNull(),
  correctOptionId: text("correct_option_id").notNull(),
  explanation: text("explanation"),
  orderIndex: integer("order_index").notNull().default(0),
});

export type Mcq = typeof mcqsTable.$inferSelect;
