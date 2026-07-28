import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import subjectsRouter from "./subjects";
import dashboardRouter from "./dashboard";
import videosRouter from "./videos";
import pdfsRouter from "./pdfs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(subjectsRouter);
router.use(dashboardRouter);
router.use(videosRouter);
router.use(pdfsRouter);

export default router;
