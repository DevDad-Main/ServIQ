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

      let metaData;

      metaData = await prisma.chatbotMetadata.findFirst({
        where: {
          userEmail: email,
        },
      });

      if (metaData) {
        return {
          success: true,
          data: metaData,
        };
      }

      metaData = await prisma.chatbotMetadata.create({
        data: {
          userEmail: email,
        },
      });

      return {
        success: true,
        data: metaData,
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
