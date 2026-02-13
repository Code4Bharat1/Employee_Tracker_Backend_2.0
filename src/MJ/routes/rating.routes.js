import express from "express";
import {
  getEmployeerating,
  generateRating,
  getAllRatings,
  deleteRating
} from "../controllers/rating.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();


// Get Employee Rating
router.get(
  "/employee/:id",
  protect,
  allowRoles("ADMIN", "PROJECT_MANAGER", "EMPLOYEE"),
  getEmployeerating
);

// Generate Rating
router.post(
  "/generate",
  protect,
  allowRoles("ADMIN", "PROJECT_MANAGER"),
  generateRating
);

// Get All Ratings
router.get(
  "/all",
  protect,
  allowRoles("ADMIN", "PROJECT_MANAGER"),
  getAllRatings
);

// Delete Rating
router.delete(
  "/delete/:id",
  protect,
  allowRoles("ADMIN"),
  deleteRating
);

export default router;
