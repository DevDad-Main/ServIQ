import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/fetch", authMiddleware, chatbotController);

export default router;
