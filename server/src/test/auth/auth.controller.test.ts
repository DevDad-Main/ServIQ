import app from "@/app";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("Auth Controller", () => {
  describe("GET /api/auth/status", () => {
    it("should return the authenticated user's status", async () => {
      const response = await request(app)
        .get("/api/auth/status")
        .set("Cookie", "user_session=mock_token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          authenticated: true,
          user: {
            email: "test@example.com",
            organization_id: "1",
          },
        },
        message: "Fetched User From Session Successfully",
        status: "success",
      });
    });

    it("should return 401 for unauthenticated request", async () => {
      const response = await request(app).get("/api/auth/status").expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: "Unauthorized User",
      });
    });
  });

  describe("GET /api/auth/callback", () => {
    it("should redirect to the dashboard", async () => {
      const response = await request(app)
        .get("/api/auth/callback")
        .set("Cookie", "user_session=mock_token");

      // TODO: Implement vi.mocks above for the callback and any other necesary details we need to mock to test our callback function

      // expect(response.status).toBe(302);
      // expect(response.headers.location).toBe("/dashboard");
    });
  });
});
