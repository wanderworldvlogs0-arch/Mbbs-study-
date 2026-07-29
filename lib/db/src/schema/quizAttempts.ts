import { pgTable, integer, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { subjectsTable } from "./subjects";

export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjectsTable.id, { onDelete: "cascade" }),
  totalQuestions: integer("total_questions").notNull(),
  correctCount: integer("correct_count").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
});

export type QuizAttempt = typeof quizAttemptsTable.$inferSelect;
