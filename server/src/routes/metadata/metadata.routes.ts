import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { metadataController } from "@/controllers/metadata.controller";

const router = Router();

router.post("/store", authMiddleware, metadataController.create);
router.get("/fetch", authMiddleware, metadataController.get);

export default router;
