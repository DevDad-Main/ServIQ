import { knowledgeController } from "@/controllers/knowledge.controller";
import { upload } from "@/lib/multer";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Knowledge route is working!",
    timestamp: new Date().toISOString(),
  });
});

router.post(
  "/store",
  upload.single("file"),
  authMiddleware,
  knowledgeController.store,
);
router.get("/fetch", authMiddleware, knowledgeController.fetch);

export default router;
