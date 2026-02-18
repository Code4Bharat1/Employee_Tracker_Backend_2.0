import express from "express";
import { getWeeklyReport } from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.get("/weekly/:employeeId", protect, allowRoles("IT_ADMIN","PROJECT_MANAGER"), getWeeklyReport);

export default router;