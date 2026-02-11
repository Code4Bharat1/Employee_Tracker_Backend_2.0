import express from "express";
import {
    createModule,
    getModules,
    updateModule,
    deleteModule,
} from "../controllers/module.controller.js";
import  { protect }from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createModule);
router.get("/list", protect, getModules);
router.put("/update/:id", protect, updateModule);
router.delete("/delete/:id", protect, deleteModule);


export default router;