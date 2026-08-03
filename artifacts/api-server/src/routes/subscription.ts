import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/require-auth";

const router: IRouter = Router();
router.use(requireAuth);

const VALID_PLANS = new Set(["free", "pro", "elite"]);

// Current plan for the signed-in user.
router.get("/subscription", (req, res) => {
  res.json({ plan: req.user!.plan });
});

// Select a plan. There's no payment gateway wired up yet, so this just
// records the choice — treat it as "start using this plan" rather than a
// real checkout/billing flow.
router.post("/subscription/select", async (req, res) => {
  const userId = req.user!.id;
  const { planId } = req.body as { planId?: string };

  if (!planId || !VALID_PLANS.has(planId)) {
    res.status(400).json({ message: "planId must be one of free, pro, elite" });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set({ plan: planId })
    .where(eq(usersTable.id, userId))
    .returning({ plan: usersTable.plan });

  res.json({ plan: updated!.plan });
});

export default router;
