import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import { Readable } from "stream";
import { openai, summarizeMarkdown } from "@/lib/openAI";
import { logger } from "devdad-express-utils";
import {
  CreateKnowledgeInput,
  KnowledgeSource,
  KnowledgeType,
  ParsedCSVResult,
  ScrapeResult,
} from "@/types/knowledge";

const prisma = new PrismaClient();

export const knowledgeService = {
  async parseCSV(buffer: Buffer): Promise<ParsedCSVResult> {
    const results: Record<string, unknown>[] = await new Promise(
      (resolve, reject) => {
        const stream = Readable.from(buffer);

        stream
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", (error) => reject(error));
      },
    );

    logger.info(`[KNOWLEDGE_SERVICE] Parsed ${results.length} rows from CSV`);

    return {
      rows: results,
      totalRows: results.length,
      firstTen: results.slice(0, 10),
    };
  },

  async scrapeWebsite(url: string): Promise<ScrapeResult> {
    const zenUrl = new URL("https://api.zenrows.com/v1/");
    zenUrl.searchParams.set("apikey", process.env.ZENROWS_API_KEY as string);
    zenUrl.searchParams.set("url", url);
    zenUrl.searchParams.set("response_type", "markdown");

    const response = await fetch(zenUrl.toString(), {
      headers: {
        "User-Agent": "ServIQBot/1.0",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `ZenRows request failed with status ${response.status}: ${errorBody.slice(
          0,
          500,
        )}`,
      );
    }

    const markdown = await response.text();

    logger.info(`[KNOWLEDGE_SERVICE] Scraped ${url}, markdown length: ${markdown.length}`);

    return {
      markdown,
      url,
      success: true,
    };
  },

  async summarizeContent(text: string): Promise<string> {
    try {
      const summary = await summarizeMarkdown(text);
      logger.info(
        `[KNOWLEDGE_SERVICE] Summarized content, length: ${summary.length}`,
      );
      return summary;
    } catch (error) {
      logger.error("[KNOWLEDGE_SERVICE] Summarization error:", error);
      throw error;
    }
  },

  async create(input: CreateKnowledgeInput): Promise<KnowledgeSource> {
    const { type, userEmail, url, title, content, csvData } = input;

    const name = title || (url ? new URL(url).hostname : "Text Input");

    let sourceContent = content;

    // Process based on type
    if (type === "upload" && csvData) {
      const csvJson = JSON.stringify(csvData);
      sourceContent = await this.summarizeContent(csvJson);
    } else if (type === "website" && content) {
      sourceContent = await this.summarizeContent(content);
    }

    const source = await prisma.knowledgeSource.create({
      data: {
        userEmail,
        type,
        name,
        sourceUrl: url || null,
        content: sourceContent,
        status: "active",
      },
    });

    logger.info(`[KNOWLEDGE_SERVICE] Created knowledge source: ${source.id}`);

    return {
      id: source.id,
      userEmail: source.userEmail,
      type: source.type as KnowledgeType,
      name: source.name,
      sourceUrl: source.sourceUrl || undefined,
      content: source.content,
      status: source.status as "active" | "processing" | "error",
      createdAt: source.createdAt,
      updatedAt: source.updatedAt,
    };
  },

  async getByUser(userEmail: string): Promise<KnowledgeSource[]> {
    const sources = await prisma.knowledgeSource.findMany({
      where: { userEmail },
      orderBy: { createdAt: "desc" },
    });

    return sources.map((source) => ({
      id: source.id,
      userEmail: source.userEmail,
      type: source.type as KnowledgeType,
      name: source.name,
      sourceUrl: source.sourceUrl || undefined,
      content: source.content,
      status: source.status as "active" | "processing" | "error",
      createdAt: source.createdAt,
      updatedAt: source.updatedAt,
    }));
  },

  async delete(id: string, userEmail: string): Promise<void> {
    await prisma.knowledgeSource.delete({
      where: {
        id,
        userEmail,
      },
    });

    logger.info(`[KNOWLEDGE_SERVICE] Deleted knowledge source: ${id}`);
  },

  async updateStatus(
    id: string,
    status: "active" | "processing" | "error",
  ): Promise<void> {
    await prisma.knowledgeSource.update({
      where: { id },
      data: { status },
    });
  },
};
