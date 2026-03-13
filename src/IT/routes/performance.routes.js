import { Router } from "express";

const router = Router();

router.get("/stats", protect, getPerformanceStats);
router.get("/trend", protect, getModuleTrend);
router.get("/projects", protect, getProjectLeaderboard);
router.get("/top-performers", protect, getTopPerformers);

export default router;