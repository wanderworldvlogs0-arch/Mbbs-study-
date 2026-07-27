import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { subjectsTable } from "./subjects";

export const chaptersTable = pgTable("chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjectsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  orderIndex: integer("order_index").notNull(),
  subChapterCount: integer("sub_chapter_count").notNull().default(0),
  estimatedMinutes: integer("estimated_minutes").notNull().default(0),
});

export type Chapter = typeof chaptersTable.$inferSelect;
