import { pool } from "./index";

async function ensureColumns() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS subscription_expires_at timestamp with time zone
    `);
    console.log("subscription_expires_at column ensured.");

    await pool.query(`
      ALTER TABLE daily_activity
      ADD COLUMN IF NOT EXISTS flashcards_done integer NOT NULL DEFAULT 0
    `);
    console.log("flashcards_done column ensured.");
    await pool.query(`
      ALTER TABLE daily_activity
      ADD COLUMN IF NOT EXISTS doubts_done integer NOT NULL DEFAULT 0
    `);
    console.log("doubts_done column ensured.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

ensureColumns();
