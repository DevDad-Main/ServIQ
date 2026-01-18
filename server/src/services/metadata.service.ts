import { prisma } from "@/lib/prisma";

export interface MetadataInput {
  business_name: string;
  website_url: string;
  external_links?: Record<string, string>;
}

export interface MetadataResult {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    userEmail: string;
    businessName: string;
    websiteUrl: string;
    externalLinks: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface MetadataWithExists {
  exists: boolean;
  source?: "database";
  data?: MetadataResult["data"];
  error?: string;
}

export const metadataService = {
  async create(
    userEmail: string,
    input: MetadataInput,
  ): Promise<MetadataResult> {
    if (!input.business_name || !input.website_url) {
      return { success: false, error: "Business name and website URL are required" };
    }

    try {
      const metadata = await prisma.metadata.create({
        data: {
          userEmail,
          businessName: input.business_name,
          websiteUrl: input.website_url,
          externalLinks: input.external_links
            ? JSON.stringify(input.external_links)
            : null,
        },
      });

      return {
        success: true,
        data: {
          id: metadata.id,
          userEmail: metadata.userEmail,
          businessName: metadata.businessName,
          websiteUrl: metadata.websiteUrl,
          externalLinks: metadata.externalLinks,
          createdAt: metadata.createdAt,
          updatedAt: metadata.createdAt,
        },
      };
    } catch (error) {
      console.error("Failed to create metadata:", error);
      return { success: false, error: "Failed to create metadata" };
    }
  },

  async getByUserEmail(userEmail: string): Promise<MetadataWithExists> {
    try {
      const record = await prisma.metadata.findFirst({
        where: { userEmail },
      });

      if (record) {
        return {
          exists: true,
          source: "database",
          data: {
            id: record.id,
            userEmail: record.userEmail,
            businessName: record.businessName,
            websiteUrl: record.websiteUrl,
            externalLinks: record.externalLinks,
            createdAt: record.createdAt,
            updatedAt: record.createdAt,
          },
        };
      }

      return { exists: false };
    } catch (error) {
      console.error("Failed to get metadata:", error);
      return { exists: false, error: "Failed to fetch metadata" };
    }
  },
};
