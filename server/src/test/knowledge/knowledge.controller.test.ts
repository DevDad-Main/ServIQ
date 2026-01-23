import request from "supertest";
import app from "@/app";
import { knowledgeService } from "@/services/knowledge.service";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { KnowledgeSource, KnowledgeType } from "@/types/knowledge";

// Mock the auth middleware to simulate authenticated users
vi.mock("@/middleware/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    const token = req.cookies?.user_session;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User",
      });
    }
    // Mock user for valid token
    req.user = { email: "test@example.com", organization_id: "1" };
    next();
  },
}));

// Mock the knowledge service to avoid external dependencies
vi.mock("@/services/knowledge.service", () => ({
  knowledgeService: {
    getByUser: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    parseCSV: vi.fn(),
    scrapeWebsite: vi.fn(),
    summarizeContent: vi.fn(),
  },
}));

// Mock multer to handle file uploads
vi.mock("@/lib/multer", () => ({
  upload: {
    single: () => (req: any, res: any, next: any) => {
      next();
    },
  },
}));

describe("Knowledge Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the service methods that are called internally
    vi.mocked(knowledgeService.scrapeWebsite).mockResolvedValue({
      markdown: "Scraped content",
      url: "https://example.com",
      success: true,
    });

    vi.mocked(knowledgeService.create).mockImplementation(
      async (input: any) => {
        return {
          id: "1",
          userEmail: "test@example.com",
          type: input.type as KnowledgeType,
          name:
            input.title ||
            (input.url ? new URL(input.url).hostname : "Test Title"),
          sourceUrl: input.url || undefined,
          content: "Processed content",
          status: "active" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
    );
  });

  describe("GET /api/knowledge/fetch", () => {
    it("should return knowledge sources for authenticated user", async () => {
      const mockSources: KnowledgeSource[] = [
        {
          id: "1",
          userEmail: "test@example.com",
          type: "website" as KnowledgeType,
          name: "Test Site",
          sourceUrl: "https://example.com",
          content: "Test content",
          status: "active" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(knowledgeService.getByUser).mockResolvedValue(mockSources);

      const response = await request(app)
        .get("/api/knowledge/fetch")
        .set("Cookie", "user_session=valid-token")
        .expect(200);

      expect(response.body).toMatchObject({
        status: "success",
        message: "Knowledge sources fetched",
        data: {
          sources: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              userEmail: "test@example.com",
              type: "website",
              name: "Test Site",
              sourceUrl: "https://example.com",
              content: "Test content",
              status: "active",
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
        },
      });
      expect(knowledgeService.getByUser).toHaveBeenCalledWith(
        "test@example.com",
      );
    });

    it("should return 401 for unauthenticated request", async () => {
      const response = await request(app)
        .get("/api/knowledge/fetch")
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: "Unauthorized User",
      });
    });
  });

  describe("POST /api/knowledge/store", () => {
    it("should create knowledge source from website URL", async () => {
      const mockSource: KnowledgeSource = {
        id: "1",
        userEmail: "test@example.com",
        type: "website" as KnowledgeType,
        name: "example.com",
        sourceUrl: "https://example.com",
        content: "Scraped content",
        status: "active" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(knowledgeService.create).mockResolvedValue(mockSource);

      const response = await request(app)
        .post("/api/knowledge/store")
        .set("Cookie", "user_session=valid-token")
        .send({ type: "website", url: "https://example.com" })
        .expect(201);

      expect(response.body).toMatchObject({
        status: "success",
        message: "Website scraped and processed",
        data: { source: expect.any(Object) },
      });
    });

    it("should create knowledge source from text", async () => {
      const mockSource: KnowledgeSource = {
        id: "1",
        userEmail: "test@example.com",
        type: "text" as KnowledgeType,
        name: "Test Title",
        content: "Summarized content",
        status: "active" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(knowledgeService.create).mockResolvedValue(mockSource);

      const response = await request(app)
        .post("/api/knowledge/store")
        .set("Cookie", "user_session=valid-token")
        .send({
          type: "text",
          title: "Test Title",
          content: "This is test content to be summarized",
        })
        .expect(201);

      expect(response.body).toMatchObject({
        status: "success",
        message: "Text processed",
        data: { source: expect.any(Object) },
      });
    });

    it("should return 400 for invalid request", async () => {
      const response = await request(app)
        .post("/api/knowledge/store")
        .set("Cookie", "user_session=valid-token")
        .send({ type: "invalid" })
        .expect(400);

      expect(response.body).toMatchObject({
        status: "error",
        message: "Invalid request",
      });
    });

    it("should return 401 for unauthenticated request", async () => {
      const response = await request(app)
        .post("/api/knowledge/store")
        .send({ type: "text", title: "Test", content: "test" })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: "Unauthorized User",
      });
    });
  });

  describe("DELETE /api/knowledge/:id", () => {
    it("should delete knowledge source for authenticated user", async () => {
      vi.mocked(knowledgeService.delete).mockResolvedValue(undefined);

      const response = await request(app)
        .delete("/api/knowledge/1")
        .set("Cookie", "user_session=valid-token")
        .expect(200);

      expect(response.body).toMatchObject({
        status: "success",
        message: "Knowledge source deleted",
      });
      expect(knowledgeService.delete).toHaveBeenCalledWith(
        "1",
        "test@example.com",
      );
    });

    it("should return 401 for unauthenticated request", async () => {
      const response = await request(app)
        .delete("/api/knowledge/1")
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: "Unauthorized User",
      });
    });
  });
});
