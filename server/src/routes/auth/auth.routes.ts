import { Router } from "express";
import { authController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();

router.get("/", authController.initiate);
router.get("/status", authMiddleware, authController.status);
router.get("/callback", authController.callback);
router.post("/logout", authController.logout);
router.get("/debug-cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: req.headers,
  });
});

export default router;
