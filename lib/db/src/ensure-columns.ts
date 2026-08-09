import { pool } from "./index";

async function ensureColumns() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS subscription_expires_at timestamp with time zone
    `);
    console.log("subscription_expires_at column ensured.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

ensureColumns();
