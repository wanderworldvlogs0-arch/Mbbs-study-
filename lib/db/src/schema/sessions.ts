import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

// The session "token" (id) is the opaque, random value stored in the
// user's cookie. Only its hash lives here so a leaked DB row can't be
// replayed as a live session cookie.
export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(), // sha256 hash of the session token
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Session = typeof sessionsTable.$inferSelect;
