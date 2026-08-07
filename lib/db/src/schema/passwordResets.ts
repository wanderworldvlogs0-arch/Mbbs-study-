import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

// A password-reset OTP request. Only the sha256 hash of the OTP is stored
// (same approach as `sessions.id`) so a DB leak alone can't be used to
// reset someone's password. Each row is short-lived and single-use.
export const passwordResetsTable = pgTable("password_resets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  otpHash: text("otp_hash").notNull(), // sha256 hash of the 6-digit OTP
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  attempts: integer("attempts").notNull().default(0), // failed verify attempts
  consumed: boolean("consumed").notNull().default(false), // used once, then dead
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PasswordReset = typeof passwordResetsTable.$inferSelect;
