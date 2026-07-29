
import { pool } from "./index";

async function fixConstraint() {
  try {
    await pool.query(`
      ALTER TABLE daily_activity
      ADD CONSTRAINT daily_activity_user_id_date_unique UNIQUE (user_id, date)
    `);
    console.log("Constraint added.");
  } catch (err: any) {
    // Already applied in a previous deploy — safe to ignore. Postgres can
    // report this under a few different error codes/messages depending on
    // how the conflict is detected, so match on the message text instead
    // of a single fixed code.
    const message = String(err?.message ?? "");
    if (message.includes("already exists")) {
      console.log("Constraint already exists, skipping.");
    } else {
      console.error(err);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

fixConstraint();
