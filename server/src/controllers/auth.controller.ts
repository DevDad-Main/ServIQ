import { Response } from "express";
import { AuthRequest } from "@/types/express";
import { logger, sendError, sendSuccess } from "devdad-express-utils";
import { authService } from "@/services/auth.service";
import { signSession, verifySession } from "@/lib/jwt";

export const authController = {
  status: (req: AuthRequest, res: Response): void => {
    sendSuccess(
      res,
      {
        authenticated: true,
        user: req.user,
      },
      "Fetched User From Session Successfully",
      200,
    );
  },

  initiate: (_req: AuthRequest, res: Response): void => {
    try {
      const state = authService.generateState();
      const isProduction = process.env.NODE_ENV === "production";

      if (isProduction) {
        res.cookie("sk_state", state, {
          httpOnly: true,
          secure: true,
          sameSite: "none" as const,
          path: "/",
        });
      } else {
        res.cookie("sk_state", state, {
          httpOnly: true,
          secure: false,
          sameSite: false as const,
          path: "/",
          domain: "localhost",
        });
      }

      const options = authService.getInitiateOptions(state);
      const authorizationURL = authService.getAuthorizationUrl(options);

      res.redirect(authorizationURL);
    } catch (error) {
      console.error("Auth initiation error:", error);
      res.status(500).json({ error: "Failed to initiate authentication" });
    }
  },

  callback: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      logger.info("GET: /api/auth/callback", {
        URL: req.url,
        query: req.query,
      });

      const code = req.query.code as string | undefined;
      const error = req.query.error as string | undefined;
      const errorDescription = req.query.error_description as
        | string
        | undefined;
      const state = req.query.state as string | undefined;

      const isProduction = process.env.NODE_ENV === "production";
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

      // ---- Error from Scalekit ----
      if (error) {
        res.clearCookie("sk_state", {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
        });

        return sendError(res, errorDescription || "Authentication error", 401, {
          error,
        });
      }

      // ---- Missing code ----
      if (!code) {
        res.clearCookie("sk_state", {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
        });

        return sendError(res, "No authorization code found", 400);
      }

      // ---- State validation ----
      if (!state || state !== req.cookies.sk_state) {
        res.clearCookie("sk_state", {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
        });

        return sendError(res, "Invalid state parameter", 400);
      }

      // ---- Clear state cookie ----
      res.clearCookie("sk_state", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      });

      // ---- Authenticate with Scalekit ----
      const authResult = await authService.authenticateWithCode(code);

      if (!authResult.success || !authResult.session) {
        return sendError(res, authResult.error || "Authentication Failed", 401);
      }

      // ---- Create signed JWT ----
      const token = signSession(authResult.session);

      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : ("lax" as const),
        path: "/",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      };

      // ---- Use your sendSuccess wrapper ----
      sendSuccess(
        res,
        { authenticated: true },
        "Authentication Successful",
        200,
        [
          (res) => {
            res.cookie("user_session", token, cookieOptions);
          },
          (res) => {
            res.redirect(frontendURL);
          },
        ],
      );
    } catch (error: any) {
      logger.error("Auth callback error", error);

      return sendError(res, error?.message || "Authentication Failed", 500);
    }
  },

  logout: (_req: AuthRequest, res: Response): void => {
    sendSuccess(res, {}, "Logged out successfully", 200, [
      (res) =>
        res.clearCookie("user_session", {
          httpOnly: true,
          secure: true,
          sameSite: "none" as const,
          path: "/",
        }),
      (res) =>
        res.clearCookie("sk_state", {
          httpOnly: true,
          secure: true,
          sameSite: "none" as const,
          path: "/",
        }),
    ]);
  },
};
