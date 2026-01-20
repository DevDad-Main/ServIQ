import { AuthRequest } from "@/middleware/auth.middleware";
import { catchAsync, sendError, sendSuccess } from "devdad-express-utils";
import { Response } from "express";
import { knowledgeService } from "@/services/knowledge.service";

export const knowledgeController = {
  fetch: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      return sendError(res, "Unauthorized", 401);
    }

    const sources = await knowledgeService.getByUser(user.email);

    return sendSuccess(res, { sources }, "Knowledge sources fetched", 200);
  }),

  store: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const csvFile = req.file;
    const { type, url, content, title } = req.body;

    if (!user) {
      return sendError(res, "Unauthorized", 401);
    }

    if (type === "upload" && csvFile && csvFile.buffer) {
      const parsed = await knowledgeService.parseCSV(csvFile.buffer);
      const source = await knowledgeService.create({
        type: "upload",
        userEmail: user.email,
        title: csvFile.originalname,
        csvData: parsed.rows,
      });

      return sendSuccess(
        res,
        {
          source,
          rowsParsed: parsed.totalRows,
        },
        "CSV uploaded and processed",
        201,
      );
    }

    if (type === "website" && url) {
      const scraped = await knowledgeService.scrapeWebsite(url);

      console.log("SCRAPED CONTENT...", scraped);
      const source = await knowledgeService.create({
        type: "website",
        userEmail: user.email,
        url,
        content: scraped.markdown,
      });

      return sendSuccess(res, { source }, "Website scraped and processed", 201);
    }

    if (type === "text" && content && title) {
      const summarized = await knowledgeService.summarizeContent(content);
      const source = await knowledgeService.create({
        type: "text",
        userEmail: user.email,
        title,
        content: summarized,
      });

      return sendSuccess(res, { source }, "Text processed", 201);
    }

    return sendError(res, "Invalid request", 400);
  }),

  delete: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return sendError(res, "Unauthorized", 401);
    }

    await knowledgeService.delete(id, user.email);

    return sendSuccess(res, null, "Knowledge source deleted", 200);
  }),
};
