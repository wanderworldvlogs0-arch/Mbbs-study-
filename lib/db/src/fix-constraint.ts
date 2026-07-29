import { pool } from "./index";

async function fixConstraint() {
  try {
    await pool.query(`
      ALTER TABLE daily_activity
      ADD CONSTRAINT daily_activity_user_id_date_unique UNIQUE (user_id, date)
    `);
    console.log("Constraint added.");
  } catch (err: any) {
    // 42710 = constraint already exists — safe to ignore, just means it's
    // already been applied in a previous deploy.
    if (err.code === "42710") {
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
