import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getModuleTrend, getPerformanceStats, getProjectLeaderboard, getTeamSkillRadar, getTopPerformers } from "../controllers/performance.controller.js";

const router = Router();

router.get("/stats", protect, getPerformanceStats);
router.get("/trend", protect, getModuleTrend);
router.get("/project-leaderboard", protect, getProjectLeaderboard);
router.get("/top-performers", protect, getTopPerformers);
router.get("/team-skill-radar", protect, getTeamSkillRadar);

export default router;