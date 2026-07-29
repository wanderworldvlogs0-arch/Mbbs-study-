import { pgTable, uuid, text, boolean, primaryKey } from "drizzle-orm/pg-core";
import { quizAttemptsTable } from "./quizAttempts";
import { mcqsTable } from "./mcqs";

export const quizAnswersTable = pgTable(
  "quiz_answers",
  {
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => quizAttemptsTable.id, { onDelete: "cascade" }),
    mcqId: uuid("mcq_id")
      .notNull()
      .references(() => mcqsTable.id, { onDelete: "cascade" }),
    selectedOptionId: text("selected_option_id"), // null = skipped
    isCorrect: boolean("is_correct").notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.attemptId, table.mcqId] })],
);

export type QuizAnswer = typeof quizAnswersTable.$inferSelect;
