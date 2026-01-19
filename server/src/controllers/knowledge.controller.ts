import { AuthRequest } from "@/middleware/auth.middleware";
import {
  catchAsync,
  logger,
  sendError,
  sendSuccess,
} from "devdad-express-utils";
import { Response } from "express";

export const knowledgeController = {
  fetch: catchAsync(async (req: AuthRequest, res: Response) => {
    logger.info("[KNOWLEDGE_FETCH] Called");
    logger.info("[KNOWLEDGE_FETCH] User:", req.user);
    return sendSuccess(res, { sources: [] }, "Knowledge sources fetched", 200);
  }),
  store: catchAsync(async (req: AuthRequest, res: Response) => {
    logger.info("[KNOWLEDGE_STORE] Content-Type:", {
      Headers: req.headers["content-type"],
    });
    logger.info("[KNOWLEDGE_STORE] req.body:", req.body);

    const user = req.user;

    if (!user) {
      logger.error("[KNOWLEDGE_STORE] No user found!");
      return sendError(res, "Unauthorized", 401);
    }

    logger.info("[KNOWLEDGE_STORE] Processing upload for user:", {
      user: user.email,
    });

    if (!req.file) {
      logger.error("[KNOWLEDGE_STORE] No file in request!");
      return sendError(res, "No file uploaded", 400);
    }

    logger.info("[KNOWLEDGE_STORE] File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    return sendSuccess(
      res,
      {
        message: "File uploaded successfully",
        file: req.file.originalname,
      },
      "Knowledge stored",
      201,
    );
  }),
};
