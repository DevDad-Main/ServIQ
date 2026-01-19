import { AuthRequest } from "@/middleware/auth.middleware";
import { catchAsync, logger, sendError } from "devdad-express-utils";
import { Response } from "express";

export const knowledgeController = {
  fetch: catchAsync(async (req: AuthRequest, res: Response) => {}),
  store: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      logger.error("No User Found", {
        PATH: req.path,
        URL: req.url,
        user: req.user,
      });
      return sendError(res, "No User Found", 401);
    }

    logger.info("[DEBUG]: req.body = ", req.body);
  }),
};
