import { prisma } from "@/lib/prisma";
import { Extensions } from "@prisma/client/runtime/react-native.js";

interface SectionInput {
  userEmail: string;
  name: string;
  description: string;
  tone: string;
  allowedTopics: string[];
  blockedTopics: string[];
  status?: string;
  sourceIds: string[];
}

interface SectionFetchInput {
  userEmail: string;
}

interface SectionUpdateInput {
  userEmail: string;
  id: string;
  name?: string;
  description?: string;
  tone?: string;
  allowedTopics?: string[];
  blockedTopics?: string[];
  status?: string;
  sourceIds?: string[];
}

interface SectionDeleteInput {
  userEmail: string;
  id: string;
}

interface defaultResponse {
  success: boolean;
  error?: string;
}

interface SectionData {
  userEmail: string;
  name: string;
  description: string;
  tone: string;
  allowedTopics: string[];
  blockedTopics: string[];
  status?: string;
  sourceIds: string[];
}

interface SectionResult extends defaultResponse {
  data?: SectionData;
}

interface SectionFetchResult extends defaultResponse {
  data?: SectionData[];
}

interface SectionUpdateResult extends defaultResponse {
  data?: SectionData;
}

interface SectionDeleteResult extends defaultResponse {
  data?: {};
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
        error: `Missing Required Fields.`,
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

  async fetch(input: SectionFetchInput): Promise<SectionFetchResult> {
    const { userEmail } = input;

    if (!userEmail) {
      return {
        success: false,
        error: "Missing userEmail",
      };
    }

    const sections = await prisma.section.findMany({
      where: {
        userEmail,
      },
    });

    if (sections.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    return {
      success: true,
      data: sections,
    };
  },

  async update(input: SectionUpdateInput): Promise<SectionUpdateResult> {
    const { userEmail, id, ...updateData } = input;

    if (!userEmail) {
      return {
        success: false,
        error: "Missing userEmail",
      };
    }

    if (!id) {
      return {
        success: false,
        error: "Missing id",
      };
    }

    try {
      const section = await prisma.section.update({
        where: {
          id,
          userEmail,
        },
        data: updateData,
      });

      if (!section) {
        return {
          success: false,
          error: "Failed to update section",
        };
      }

      return {
        success: true,
        data: {
          ...section,
        },
      };
    } catch (error) {
      console.error("Failed to update section:", error);
      return { success: false, error: "Failed to update section" };
    }
  },

  async delete(input: SectionDeleteInput): Promise<SectionDeleteResult> {
    const { userEmail, id } = input;

    if (!userEmail) {
      return {
        success: false,
        error: "Missing userEmail",
      };
    }

    if (!id) {
      return {
        success: false,
        error: "Missing id",
      };
    }

    try {
      const section = await prisma.section.delete({
        where: {
          id,
          userEmail,
        },
      });

      if (!section) {
        return {
          success: false,
          error: "Failed to delete section",
        };
      }

      return {
        success: true,
        data: {
          message: "Section Deleted Successfully",
        },
      };
    } catch (error) {
      console.error("Failed to delete section:", error);
      return { success: false, error: "Failed to delete section" };
    }
  },
};
