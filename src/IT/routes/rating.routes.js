import express from "express";
import { getRatings, getEmployeeRatingSummary } from "../controllers/rating.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.get("/", protect, allowRoles("IT_ADMIN","PROJECT_MANAGER"), getRatings);
router.get("/summary/:employeeId", protect, allowRoles("IT_ADMIN","PROJECT_MANAGER"), getEmployeeRatingSummary);

export default router;