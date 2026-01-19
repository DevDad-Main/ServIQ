import { AuthRequest } from "@/middleware/auth.middleware";
import {
  catchAsync,
  logger,
  sendError,
  sendSuccess,
} from "devdad-express-utils";
import { Response } from "express";
import csv from "csv-parser";
import { Readable } from "stream";

export const knowledgeController = {
  fetch: catchAsync(async (req: AuthRequest, res: Response) => {
    logger.info("[KNOWLEDGE_FETCH] Called");
    logger.info("[KNOWLEDGE_FETCH] User:", req.user);
    return sendSuccess(res, { sources: [] }, "Knowledge sources fetched", 200);
  }),

  store: catchAsync(async (req: AuthRequest, res: Response) => {
    logger.info("[KNOWLEDGE_STORE] Content-Type:", {
      Headers: req.headers["content-type"],
    });
    logger.info("[KNOWLEDGE_STORE] req.body:", req.body);

    const user = req.user;
    const csvFile = req.file;

    if (!user) {
      logger.error("[KNOWLEDGE_STORE] No user found!");
      return sendError(res, "Unauthorized", 401);
    }

    logger.info("[KNOWLEDGE_STORE] Processing upload for user:", {
      user: user.email,
    });

    if (!csvFile || !csvFile.buffer) {
      logger.error("[KNOWLEDGE_STORE] No file in request!");
      return sendError(res, "No file uploaded", 400);
    }

    logger.info("[KNOWLEDGE_STORE] File received:", {
      originalname: csvFile.originalname,
      mimetype: csvFile.mimetype,
      size: csvFile.size,
    });

    // Parse CSV from memory buffer using stream
    let results: any = [];
    await new Promise((resolve, reject) => {
      const stream = Readable.from(csvFile.buffer);

      stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          logger.info(
            `[KNOWLEDGE_STORE] Parsed ${results.length} rows from CSV`,
          );
          resolve(results);
        })
        .on("error", (error) => {
          logger.error("[KNOWLEDGE_STORE] CSV parsing error:", error);
          reject(error);
        });
    });

    // Log first 10 results only
    const first10 = results.slice(0, 10);
    logger.info("[KNOWLEDGE_STORE] First 10 results:");
    console.log(JSON.stringify(first10, null, 2));

    logger.info(`[KNOWLEDGE_STORE] Total rows parsed: ${results.length}`);

    return sendSuccess(
      res,
      {
        message: "File uploaded successfully",
        file: csvFile.originalname,
        rowsParsed: results.length,
      },
      "Knowledge stored",
      201,
    );
  }),
};
