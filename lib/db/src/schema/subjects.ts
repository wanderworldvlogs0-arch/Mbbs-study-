import { pgTable, text, integer, pgEnum } from "drizzle-orm/pg-core";

export const subjectThemeEnum = pgEnum("subject_theme", [
  "preclinical",
  "paraclinical",
  "clinical",
]);

// Catalog data (seeded once via `pnpm --filter @workspace/db run seed`),
// not created per-user. `id` is a stable slug like "anatomy".
export const subjectsTable = pgTable("subjects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  theme: subjectThemeEnum("theme").notNull(),
  icon: text("icon").notNull(), // lucide-react icon name, e.g. "Bone"
  chapterCount: integer("chapter_count").notNull().default(0),
  mcqCount: integer("mcq_count").notNull().default(0),
  videoCount: integer("video_count").notNull().default(0),
});

export type Subject = typeof subjectsTable.$inferSelect;
