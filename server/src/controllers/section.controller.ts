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

    // if (
    //   !allowedTopics ||
    //   !Array.isArray(allowedTopics) ||
    //   allowedTopics.length === 0
    // ) {
    //   return sendError(
    //     res,
    //     "Invalid allowedTopics Array. At least one source is required",
    //     400,
    //   );
    // }

    // if (
    //   !blockedTopics ||
    //   !Array.isArray(blockedTopics) ||
    //   blockedTopics.length === 0
    // ) {
    //   return sendError(
    //     res,
    //     "Invalid blockedTopics Array. At least one source is required",
    //     400,
    //   );
    // }

    const input = {
      userEmail: user.email,
      name,
      description,
      tone,
      allowedTopics,
      blockedTopics,
      sourceIds,
    };

    const section = await sectionService.create(input);

    if (!section.success) {
      return sendError(res, section.error ?? "Failed to fetch section", 404);
    }

    if (!section.data) {
      return sendError(res, "No Sections Data Found", 404);
    }

    return sendSuccess(res, section, "Section Created Successfully", 201);
  }),

  fetch: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      return sendError(res, "Unauthorized", 401);
    }

    const sections = await sectionService.fetch({
      userEmail: user.email,
    });

    if (!sections.success) {
      return sendError(res, sections.error ?? "Failed to fetch sections", 404);
    }

    if (!sections.data) {
      return sendError(res, "No Sections Data Found", 404);
    }

    return sendSuccess(
      res,
      sections.data,
      "Sections Fetched Successfully",
      200,
    );
  }),

  delete: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const { id } = req.params as { id: string };

    if (!user) {
      return sendError(res, "Unauthorized", 401);
    }

    if (!id) {
      return sendError(res, "Invalid ID", 400);
    }

    const section = await sectionService.delete({
      userEmail: user.email,
      id,
    });

    if (!section.success) {
      return sendError(res, section.error ?? "Failed to delete section", 404);
    }

    return sendSuccess(res, {}, "Section Deleted Successfully", 200);
  }),
};
