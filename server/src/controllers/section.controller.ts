import { AuthRequest } from "@/middleware/auth.middleware";
import { sectionService } from "@/services/section.service";
import { catchAsync, sendError, sendSuccess } from "devdad-express-utils";
import { Response } from "express";

export const sectionController = {
  create: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const { name, description, tone, allowedTopics, blockedTopics, sourceIds } =
      req.body;

    if (!user) {
      return sendError(res, "Unauthorized", 401);
    }

    if (![name, description, tone].every(Boolean)) {
      return sendError(res, "Missing required fields", 400);
    }

    if (!sourceIds || !Array.isArray(sourceIds) || sourceIds.length === 0) {
      return sendError(
        res,
        "Invalid sourceIds Array. At least one source is required",
        400,
      );
    }

    if (
      !allowedTopics ||
      !Array.isArray(allowedTopics) ||
      allowedTopics.length === 0
    ) {
      return sendError(
        res,
        "Invalid allowedTopics Array. At least one source is required",
        400,
      );
    }

    if (
      !blockedTopics ||
      !Array.isArray(blockedTopics) ||
      blockedTopics.length === 0
    ) {
      return sendError(
        res,
        "Invalid blockedTopics Array. At least one source is required",
        400,
      );
    }
    const input = {
      userEmail: user.email,
      name,
      description,
      tone,
      allowedTopics,
      blockedTopics,
      sourceIds,
    };

    const source = await sectionService.create(input);

    if (!source) {
      return sendError(res, "Failed to create section", 500);
    }

    return sendSuccess(res, source, "Section Created Successfully", 201);
  }),
};
