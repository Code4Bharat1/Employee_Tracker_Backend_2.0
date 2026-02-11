import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middlewares.js";
import { createUser, deleteUser, getUsers, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/create-user", protect, allowRoles("IT_ADMIN"), createUser);
router.get("/get-users", protect, getUsers);
router.put("/update-user/:id", protect, allowRoles("IT_ADMIN"), updateUser);
router.delete("/delete-user/:id", protect, allowRoles("IT_ADMIN"), deleteUser);

export default router;