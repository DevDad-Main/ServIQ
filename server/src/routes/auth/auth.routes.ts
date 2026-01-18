import { Router } from "express";
import { authController } from "@/controllers/auth.controller";

const router = Router();

router.get("/", authController.initiate);
router.get("/status", authController.status);
router.get("/callback", authController.callback);
router.get("/debug-cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: req.headers,
  });
});

export default router;
