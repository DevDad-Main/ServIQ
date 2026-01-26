import { logger } from "devdad-express-utils";
import { prisma } from "../lib/prisma";

interface ChatbotMetadataFetchInput {
  email: string;
}

interface ChatbotMetaDataResult {
  success: boolean;
  error?: string;
  data?: {};
}

export const chatbotMetadataService = {
  async fetch({
    email,
  }: ChatbotMetadataFetchInput): Promise<ChatbotMetaDataResult> {
    try {
      if (!email) {
        return {
          success: false,
          error: "No Email Provided",
        };
      }

      const exisitingMetadata = await prisma.chatbotMetadata.findFirst({
        where: {
          userEmail: email,
        },
      });

      if (!exisitingMetadata) {
        // NOTE: This could be okay as if it is a new user then it's expected, otherwise something is wrong for exisitng users.
        logger.warn("No Existing Metadata Found..", {
          exisitingMetadata,
          email,
        });
        return {
          success: false,
          error: "Cannot Find Existing Metadata.",
        };
      }

      return {
        success: true,
        data: { exisitingMetadata },
      };
    } catch (error: any) {
      logger.error(
        (error.message as string) ||
          "Failed To Fetch Data From ChatbotMetaData.",
      );
      return {
        success: false,
        error: "Failed To Fetch Data From ChatbotMetaData.",
      };
    }
  },
};
