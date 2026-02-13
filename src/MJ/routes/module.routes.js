import express from "express";
import {
    createModule,
    deleteModule,
    getModules,
    updateModule,
    approveModule,
    rejectModule
}from "../controllers/module.controller.js";

import {protect} from "../middleware/auth.middleware.js";
import {allowRoles} from "../middleware/role.middleware.js";

const router = express.Router();

router.post (
    "/create-module",
    protect,
    allowRoles("MARKETING_ADMIN", "PROJECT_MANAGER"),
    createModule
);
router.get(
    "/get-modules",
    protect,
    allowRoles("MARKETING_ADMIN", "PROJECT_MANAGER"),
    getModules
);

router.put(
   "/update/:id",
    protect,
    allowRoles("MARKETING_ADMIN", "PROJECT_MANAGER"),
    updateModule
);

router.delete(
    "/delete/:id",
    protect,
    allowRoles("MARKETING_ADMIN"),
    deleteModule
);

router.patch("/:id/approve", approveModule);
router.patch("/:id/reject", rejectModule);

export default router;