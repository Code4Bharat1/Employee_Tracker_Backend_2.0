import express from "express";
import {
    createModule,
    getModules,
    updateModule,
    deleteModule,
    reviewModule,
} from "../controllers/module.controller.js";
import  { protect }from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.post("/create", protect, createModule);
router.get("/get-modules", protect, getModules);
router.put("/update/:id", protect, updateModule);
router.delete("/delete/:id", protect, deleteModule);

router.patch(
  "/review/:id",
  protect,
  allowRoles("PROJECT_MANAGER", "IT_ADMIN"),
  reviewModule
);


export default router;