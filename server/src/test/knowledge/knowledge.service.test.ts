import { describe, it, expect, vi, beforeEach } from "vitest";
import { knowledgeService } from "@/services/knowledge.service";

vi.mock("@/lib/openAI", () => ({
  openai: {},
  summarizeMarkdown: vi.fn((text: string) =>
    Promise.resolve(`Summarized: ${text}`),
  ),
}));

vi.mock("axios", () => ({
  default: vi.fn(),
}));

vi.mock("devdad-express-utils", () => ({
  AppError: vi.fn(),
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Prisma to avoid database dependency during service testing
vi.mock("@/lib/prisma", () => ({
  prisma: vi.fn().mockImplementation(() => ({
    knowledgeSource: {
      create: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  })),
}));

describe("Knowledge Service Core Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("parseCSV", () => {
    it("should parse CSV buffer correctly", async () => {
      const csvData = "name,age\nJohn,30\nJane,25";
      const buffer = Buffer.from(csvData);

      const result = await knowledgeService.parseCSV(buffer);

      expect(result.totalRows).toBe(2);
      expect(result.rows).toEqual([
        { name: "John", age: "30" },
        { name: "Jane", age: "25" },
      ]);
      expect(result.firstTen).toHaveLength(2);
    });

    it("should handle empty CSV", async () => {
      const csvData = "";
      const buffer = Buffer.from(csvData);

      const result = await knowledgeService.parseCSV(buffer);

      expect(result.totalRows).toBe(0);
      expect(result.rows).toEqual([]);
      expect(result.firstTen).toEqual([]);
    });
  });

  describe("summarizeContent", () => {
    it("should summarize content using OpenAI", async () => {
      const { summarizeMarkdown } = await import("@/lib/openAI.js");
      const mockSummary = "This is a summarized version";
      vi.mocked(summarizeMarkdown).mockResolvedValue(mockSummary);

      const result =
        await knowledgeService.summarizeContent("Long text content");

      expect(result).toBe(mockSummary);
      expect(summarizeMarkdown).toHaveBeenCalledWith("Long text content");
    });
  });
});
