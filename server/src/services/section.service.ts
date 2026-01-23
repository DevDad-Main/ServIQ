import { prisma } from "@/lib/prisma";

export interface SectionInput {
  userEmail: string;
  name: string;
  description: string;
  tone: string;
  allowedTopics: string[];
  blockedTopics: string[];
  status?: string;
  sourceIds: string[];
}

export interface SectionResult {
  success: boolean;
  error?: string;
  data?: {
    userEmail: string;
    name: string;
    description: string;
    tone: string;
    allowedTopics: string[];
    blockedTopics: string[];
    status?: string;
    sourceIds: string[];
  };
}

export const sectionService = {
  async create(input: SectionInput): Promise<SectionResult> {
    if (
      !input.name ||
      !input.userEmail ||
      !input.description ||
      !input.tone ||
      !input.allowedTopics ||
      !input.blockedTopics ||
      !input.sourceIds
    ) {
      return {
        success: false,
        error: `Missing Required Fields. ${
          (input.name,
          !input.userEmail,
          input.description,
          input.tone,
          input.allowedTopics,
          input.blockedTopics,
          input.sourceIds)
        }`,
      };
    }

    try {
      const section = await prisma.section.create({
        data: {
          userEmail: input.userEmail,
          name: input.name,
          description: input.description,
          sourceIds: input.sourceIds,
          tone: input.tone,
          allowedTopics: input.allowedTopics,
          blockedTopics: input.blockedTopics,
          status: input.status || "active",
        },
      });

      if (!section) {
        return {
          success: false,
          error: "Failed to create section",
        };
      }

      return {
        success: true,
        data: {
          ...section,
        },
      };
    } catch (error) {
      console.error("Failed to create section:", error);
      return { success: false, error: "Failed to create section" };
    }
  },
};
