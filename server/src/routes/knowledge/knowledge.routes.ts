import { knowledgeController } from "@/controllers/knowledge.controller";
import { upload } from "@/lib/multer";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.post(
  "/store",
  upload.single("file"),
  authMiddleware,
  knowledgeController.store,
);
router.get("/fetch", authMiddleware);

export default router;
