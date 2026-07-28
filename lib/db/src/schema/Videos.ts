import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { subjectsTable } from "./subjects";
import { chaptersTable } from "./chapters";

export const videosTable = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjectsTable.id, { onDelete: "cascade" }),
  chapterId: uuid("chapter_id").references(() => chaptersTable.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(0),
  orderIndex: integer("order_index").notNull().default(0),
});

export type Video = typeof videosTable.$inferSelect;
