import { Response } from "express";
import { AuthRequest } from "@/types/express";
import { metadataService } from "@/services/metadata.service";
import { sendError, sendSuccess } from "devdad-express-utils";
import { meta } from "zod/mini";

const HTTP_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  maxAge: 60 * 60 * 24 * 1,
};

const getCookieOptions = () => ({
  ...HTTP_OPTIONS,
});

export const metadataController = {
  create: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { business_name, website_url, external_links } = req.body;

      const result = await metadataService.create(user.email, {
        business_name,
        website_url,
        external_links,
      });

      if (!result.success || !result.data) {
        res
          .status(400)
          .json({ error: result.error || "Failed to create metadata" });
        return;
      }

      res.cookie(
        "metadata",
        JSON.stringify({ business_name: result.data.businessName }),
        getCookieOptions(),
      );
      res.status(201).json({ metadata: result.data });
    } catch (error) {
      console.error("Create metadata error:", error);
      res.status(500).json({ error: "Failed to create metadata" });
    }
  },

  get: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;

      if (!user || !user.email) {
        return sendError(res, "Unauthorized User", 401);
      }

      const metadataCookie = req.cookies?.metadata;

      if (metadataCookie) {
        console.log("[METADATA] Found metadata cookie");
        return sendSuccess(
          res,
          {
            exists: true,
            source: "cookie",
            data: JSON.parse(metadataCookie),
          },
          "Metadata fetched successfully",
          200,
        );
      }

      console.log("[METADATA] No cookie, fetching from DB for:", user.email);

      const metaDataResult = await metadataService.getByUserEmail(user.email);

      console.log("[METADATA] DB result:", metaDataResult);

      if (
        !metaDataResult ||
        !metaDataResult.exists ||
        !metaDataResult.data ||
        !metaDataResult.data.businessName
      ) {
        console.log("[METADATA] No metadata found in DB");
        return sendError(res, "Failed To Fetch User From MetaData", 400, {
          exists: false,
          data: null,
        });
      }

      console.log("[METADATA] Found metadata in DB:", metaDataResult.data);

      return sendSuccess(
        res,
        {
          exists: true,
          source: "database",
          data: metaDataResult.data,
        },
        "Successfully Fetched MetaData",
        200,
        [
          (res) => {
            res.cookie(
              "metadata",
              JSON.stringify({
                business_name: metaDataResult?.data?.businessName,
              }),
              getCookieOptions(),
            );
          },
        ],
      );
    } catch (error) {
      console.error("Get metadata error:", error);
      res.status(500).json({ error: "Failed to fetch metadata" });
    }
  },
};
