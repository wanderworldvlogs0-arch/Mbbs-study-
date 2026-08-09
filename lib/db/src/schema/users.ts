import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  academicYear: text("academic_year"),
  mobileNumber: text("mobile_number"), // <-- নতুন
  profilePhoto: text("profile_photo"), // base64 image data, <-- নতুন
  plan: text("plan").notNull().default("free"), // "free" | "pro" | "elite"
  subscriptionExpiresAt: timestamp("subscription_expires_at", { withTimezone: true }),
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  passwordHash: true,
  createdAt: true,
});

export const selectUserSchema = createSelectSchema(usersTable).omit({
  passwordHash: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
export type PublicUser = z.infer<typeof selectUserSchema>;
