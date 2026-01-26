import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { chatbotcontroller } from "../../controllers/chatbot.controller";

const router = Router();

router.get("/fetch", authMiddleware, chatbotcontroller.fetch);

export default router;
