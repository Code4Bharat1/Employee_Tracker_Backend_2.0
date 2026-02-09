import express from "express";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";
// import { allowRoles } from "../middleware/role.middleware.js";


const router=express.Router();

router.post("/create-project",protect,createProject);
router.get("/get-projects",protect,getProjects);
router.put("/update-project/:id",protect,updateProject);
router.delete("/delete-project/:id",protect,deleteProject);

export default router;