import { Router } from "express";
import { authController } from "@/controllers/auth.controller";

const router = Router();

router.get("/", authController.initiate);
router.get("/callback", authController.callback);

export default router;
