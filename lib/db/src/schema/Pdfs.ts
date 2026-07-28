import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { subjectsTable } from "./subjects";
import { chaptersTable } from "./chapters";

export const pdfsTable = pgTable("pdfs", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjectsTable.id, { onDelete: "cascade" }),
  chapterId: uuid("chapter_id").references(() => chaptersTable.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  pageCount: integer("page_count").notNull().default(0),
  orderIndex: integer("order_index").notNull().default(0),
});

export type Pdf = typeof pdfsTable.$inferSelect;
