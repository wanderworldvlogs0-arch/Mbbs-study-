import { pgTable, text, integer, uuid, pgEnum } from "drizzle-orm/pg-core";
import { subjectsTable } from "./subjects";
import { chaptersTable } from "./chapters";

export const pdfCategoryEnum = pgEnum("pdf_category", ["notes", "pyq"]);

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
  // "notes" = regular study PDF, "pyq" = previous year question paper
  category: pdfCategoryEnum("category").notNull().default("notes"),
  year: text("year"), // only used when category = "pyq", e.g. "2023"
});

export type Pdf = typeof pdfsTable.$inferSelect;
