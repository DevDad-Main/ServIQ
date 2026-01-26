import {
  catchAsync,
  logger,
  sendError,
  sendSuccess,
} from "devdad-express-utils";
import { Response } from "express";
import { AuthRequest } from "../types/express";
import { chatbotMetadataService } from "../services/chatbot.service";

export const chatbotcontroller = {
  fetch: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      logger.info("UnAuthorized.. No User Found");
      return sendError(res, "UnAuthorized, No User Found", 400);
    }

    const existingData = await chatbotMetadataService.fetch({
      email: user.email,
    });

    if (!existingData.success) {
      logger.info("Error Fetching Data From Service");
      return sendError(
        res,
        existingData.error || "Failed To Fetch Metadata From Service",
        500,
      );
    }

    if (!existingData.data) {
      logger.info("Error Fetching Data From Service");
      return sendError(
        res,
        existingData.error || "Failed To Fetch Metadata From Service",
        500,
      );
    }

    logger.info("ExisitingData...", existingData)

    return sendSuccess(
      res,
      existingData,
      "Chatbot Metadata Fetched Successfully",
      200,
    );
  }),
};
