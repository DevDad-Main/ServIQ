import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/store", authMiddleware);
router.get("/fetch", authMiddleware);

export default router;
