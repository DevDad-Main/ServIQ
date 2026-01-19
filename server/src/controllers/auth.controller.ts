import { Response } from "express";
import { AuthRequest } from "@/types/express";
import { logger, sendError, sendSuccess } from "devdad-express-utils";
import { authService } from "@/services/auth.service";

export const authController = {
  status: async (req: AuthRequest, res: Response): Promise<void> => {
    logger.info("GET: /api/auth/status", {
      URL: req.url,
      body: req.body,
      cookies: req.cookies,
      hasUserSessionCookie: !!req.cookies.user_session,
    });

    const result = await authService.getSessionFromCookie(
      req.cookies.user_session,
    );

    if (!result.success || !result.session) {
      logger.warn("Auth status: session invalid or missing", {
        hasCookie: !!req.cookies.user_session,
        cookieValue: req.cookies.user_session?.substring(0, 50) + "...",
        error: result.error,
      });
      return sendError(res, "Unauthenticated User", 401, {
        authenticated: false,
      });
    }

    // res.json({ authenticated: true, user: result.session });
    sendSuccess(
      res,
      {
        authenticated: true,
        user: result.session,
      },
      " Fetched User From Cookies Successfully",
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
        body: req.body,
      });

      const code = req.query.code as string | undefined;
      const error = req.query.error as string | undefined;
      const errorDescription = req.query.error_description as
        | string
        | undefined;
      const state = req.query.state as string | undefined;

      if (error) {
        res.clearCookie("sk_state", {
          httpOnly: true,
          sameSite: "none",
          path: "/",
        });
        return sendError(res, `${errorDescription}`, 401, {
          error,
        });
      }

      if (!code) {
        res.clearCookie("sk_state", {
          httpOnly: true,
          secure: false,
          path: "/",
          domain: "localhost",
        });
        return sendError(res, "No authorization code found", 400);
      }

      if (!state || state !== req.cookies.sk_state) {
        res.clearCookie("sk_state", {
          httpOnly: true,
          secure: false,
          path: "/",
          domain: "localhost",
        });
        return sendError(res, "Invalid state parameter", 400);
      }

      res.clearCookie("sk_state", {
        httpOnly: true,
        secure: false,
        path: "/",
        domain: "localhost",
      });

      const authResult = await authService.authenticateWithCode(code);

      if (!authResult.success || !authResult.session || !authResult) {
        return sendError(
          res,
          authResult.error || "Authentication Failed",
          401,
          {
            error: authResult.error,
          },
        );
      }

      const cookieOptions = authService.getSessionCookieOptions();
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

      sendSuccess(
        res,
        { user: authResult.session },
        "Authentication Successful",
        200,
        [
          (res) => {
            res.cookie(
              "user_session",
              JSON.stringify(authResult.session),
              cookieOptions,
            );
          },
          (res) => res.redirect(`${frontendURL}`),
        ],
      );
    } catch (error: any) {
      console.error("Auth callback error:", error);
      return sendError(
        res,
        (error?.message as string) || "Authentication Failed",
        500,
        error,
      );
    }
  },

  logout: async (_req: AuthRequest, res: Response): Promise<void> => {
    const isProduction = process.env.NODE_ENV === "production";
    
    if (isProduction) {
      res.clearCookie("user_session", {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        path: "/",
      });
      res.clearCookie("sk_state", {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        path: "/",
      });
    } else {
      res.clearCookie("user_session", {
        httpOnly: true,
        secure: false,
        path: "/",
        domain: "localhost",
      });
      res.clearCookie("sk_state", {
        httpOnly: true,
        secure: false,
        path: "/",
        domain: "localhost",
      });
    }
    
    sendSuccess(res, null, "Logged out successfully", 200);
  },
};
