import {
  pgTable,
  integer,
  uuid,
  date,
  timestamp,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { chaptersTable } from "./chapters";

export const userChapterProgressTable = pgTable(
  "user_chapter_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    chapterId: uuid("chapter_id")
      .notNull()
      .references(() => chaptersTable.id, { onDelete: "cascade" }),
    progressPercent: integer("progress_percent").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.chapterId] })],
);

// One row per user per calendar day. Backs the dashboard's daily goals,
// study timer, and weekly streak.
export const dailyActivityTable = pgTable(
  "daily_activity",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    secondsStudied: integer("seconds_studied").notNull().default(0),
    chaptersDone: integer("chapters_done").notNull().default(0),
    mcqsDone: integer("mcqs_done").notNull().default(0),
    videosDone: integer("videos_done").notNull().default(0),
  });

export type UserChapterProgress = typeof userChapterProgressTable.$inferSelect;
export type DailyActivity = typeof dailyActivityTable.$inferSelect;
