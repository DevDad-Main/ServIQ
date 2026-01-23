import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { sectionController } from "@/controllers/section.controller";

const router = Router();

router.post("/create", authMiddleware, sectionController.create);

export default router;
