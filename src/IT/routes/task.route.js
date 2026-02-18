import express from "express";
import { createTask, deleteTask, getTasks, reviewTask, updateTask } from "../controllers/task.controller.js";
import {protect} from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middlewares.js";
const router=express.Router();

router.post("/create-task",protect,createTask);
router.get("/get-tasks",protect,getTasks);
router.put("/update-task/:id",protect,updateTask);
router.delete("/delete-task/:id",protect,deleteTask);

router.patch(
  "/review/:id",
  protect,
  allowRoles("IT_ADMIN", "PROJECT_MANAGER"),
  reviewTask
);

export default router;