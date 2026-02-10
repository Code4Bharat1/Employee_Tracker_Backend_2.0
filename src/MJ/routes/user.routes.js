import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {allowRoles} from "../middleware/role.middleware.js"
import { createUser, deleteUser, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/create-user", protect, allowRoles("MARKETING_ADMIN"), createUser);
// router.get("/list", protect, allowRoles("MARKETING_ADMIN"), getUsers)
router.put("/update/:id", protect, allowRoles("MARKETING_ADMIN"), updateUser);
router.delete("/delete/id", protect, allowRoles("MARKETING_ADMIN"), deleteUser);

export default  router;