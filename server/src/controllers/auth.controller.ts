import { Response } from "express";
import crypto from "crypto";
import scaleKit from "@/lib/scalekit";
import { prisma } from "@/lib/prisma";
import { AuthRequest } from "@/types/express";

const HTTP_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
};

export const authController = {
  initiate: (_req: AuthRequest, res: Response): void => {
    try {
      const state = crypto.randomBytes(16).toString("hex");
      res.cookie("sk_state", state, HTTP_OPTIONS);

      const redirectURI = process.env.SCALEKIT_REDIRECT_URI!;
      const options = {
        scopes: ["openid", "profile", "email", "offline_access"],
        state,
      };

      const authorizationURL = scaleKit.getAuthorizationUrl(redirectURI, options);
      res.redirect(authorizationURL.toString());
    } catch (error) {
      console.error("Auth initiation error:", error);
      res.status(500).json({ error: "Failed to initiate authentication" });
    }
  },

  callback: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const code = req.query.code as string | undefined;
      const error = req.query.error as string | undefined;
      const errorDescription = req.query.error_description as string | undefined;

      if (error) {
        res.status(401).json({ error, errorDescription });
        return;
      }

      if (!code) {
        res.status(400).json({ error: "No authorization code found" });
        return;
      }

      const redirectURI = process.env.SCALEKIT_REDIRECT_URI!;
      const authResult = await scaleKit.authenticateWithCode(code, redirectURI);

      if (!authResult) {
        res.status(401).json({ error: "Authentication failed" });
        return;
      }

      const { user, idToken } = authResult;
      const claims = await scaleKit.validateToken(idToken);

      const organizationId = (claims as any).organization_id ||
        (claims as any).org_id ||
        (claims as any).oid ||
        null;

      if (!organizationId) {
        res.status(500).json({ error: "No organization ID in token claims" });
        return;
      }

      await prisma.user.upsert({
        where: { email: user.email },
        create: {
          name: user?.name || "anonymous",
          email: user.email,
          organizationId,
        },
        update: {
          name: user?.name || "anonymous",
          organizationId,
        },
      });

      const userSession = {
        email: user.email,
        organization_id: organizationId,
      };

      const sessionOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 1,
      };

      res.cookie("user_session", JSON.stringify(userSession), sessionOptions);
      res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
    } catch (error) {
      console.error("Auth callback error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  },
};
