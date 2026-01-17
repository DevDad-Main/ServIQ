import { Response } from "express";
import { prisma } from "@/lib/prisma";
import { AuthRequest } from "@/types/express";

export const metadataController = {
  create: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { business_name, website_url, external_links } = req.body;

      if (!business_name || !website_url) {
        res.status(400).json({
          error: "Business name and website URL are required",
        });
        return;
      }

      const metadata = await prisma.metadata.create({
        data: {
          userEmail: user.email,
          businessName: business_name,
          websiteUrl: website_url,
          externalLinks: external_links,
        },
      });

      const cookieOptions = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      };

      res.cookie("metadata", JSON.stringify({ business_name }), cookieOptions);
      res.status(201).json({ metadata });
    } catch (error) {
      console.error("Create metadata error:", error);
      res.status(500).json({ error: "Failed to create metadata" });
    }
  },

  get: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const metadataCookie = req.cookies?.metadata;

      if (metadataCookie) {
        res.json({
          exists: true,
          source: "cookie",
          data: JSON.parse(metadataCookie),
        });
        return;
      }

      const record = await prisma.metadata.findFirst({
        where: { userEmail: user.email },
      });

      if (record) {
        const cookieOptions = {
          httpOnly: true,
          sameSite: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        };

        res.cookie(
          "metadata",
          JSON.stringify({ business_name: record.businessName }),
          cookieOptions,
        );

        res.json({
          exists: true,
          source: "database",
          data: record,
        });
        return;
      }

      res.json({ exists: false, data: null });
    } catch (error) {
      console.error("Get metadata error:", error);
      res.status(500).json({ error: "Failed to fetch metadata" });
    }
  },
};
