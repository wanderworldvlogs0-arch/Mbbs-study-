import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/require-auth";

const router: IRouter = Router();
router.use(requireAuth);

const VALID_PLANS = new Set(["free", "pro", "elite"]);

// Current plan for the signed-in user.
router.get("/subscription", (req, res) => {
  res.json({
    plan: req.user!.plan,
    subscriptionExpiresAt: req.user!.subscriptionExpiresAt,
  });
});

// Select a plan. There's no payment gateway wired up yet, so this just
// records the choice — treat it as "start using this plan" rather than a
// real checkout/billing flow.
router.post("/subscription/select", async (req, res) => {
  const userId = req.user!.id;
  const { planId, billing } = req.body as {
    planId?: string;
    billing?: "monthly" | "yearly";
  };

  if (!planId || !VALID_PLANS.has(planId)) {
    res.status(400).json({ message: "planId must be one of free, pro, elite" });
    return;
  }

  const durationDays = billing === "yearly" ? 365 : 30;
  const subscriptionExpiresAt =
    planId === "free"
      ? null
      : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  const [updated] = await db
    .update(usersTable)
    .set({ plan: planId, subscriptionExpiresAt })
    .where(eq(usersTable.id, userId))
    .returning({
      plan: usersTable.plan,
      subscriptionExpiresAt: usersTable.subscriptionExpiresAt,
    });

  res.json({ plan: updated!.plan, subscriptionExpiresAt: updated!.subscriptionExpiresAt });
});

export default router;
