import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { sectionController } from "@/controllers/section.controller";

const router = Router();

router.post("/create", authMiddleware, sectionController.create);
router.get("/fetch", authMiddleware, sectionController.fetch);
router.delete("/delete", authMiddleware, sectionController.delete);

export default router;
