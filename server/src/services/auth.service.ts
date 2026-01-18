import scaleKit from "@/lib/scalekit";
import { prisma } from "@/lib/prisma";

export interface UserSession {
  email: string;
  organization_id: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  session?: UserSession;
}

const HTTP_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 60 * 60 * 24 * 1,
};

export const authService = {
  async getSessionFromCookie(cookie: string | undefined): Promise<AuthResult> {
    if (!cookie) {
      return { success: false };
    }

    let session: UserSession;
    try {
      session = JSON.parse(cookie);
    } catch {
      return { success: false, error: "Invalid cookie format" };
    }

    if (!session.email || !session.organization_id) {
      return { success: false };
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: session.email },
      });
    } catch {
      return { success: false, error: "Database error" };
    }

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, session };
  },

  generateState(): string {
    return require("crypto").randomBytes(16).toString("hex");
  },

  getInitiateOptions(state: string) {
    const redirectURI = process.env.SCALEKIT_REDIRECT_URI!;
    return {
      scopes: ["openid", "profile", "email", "offline_access"],
      state,
      redirectURI,
    };
  },

  getAuthorizationUrl(options: {
    redirectURI: string;
    scopes: string[];
    state: string;
  }): string {
    return scaleKit
      .getAuthorizationUrl(options.redirectURI, {
        scopes: options.scopes,
        state: options.state,
      })
      .toString();
  },

  async authenticateWithCode(code: string): Promise<AuthResult> {
    console.log(
      "[AUTH] authenticateWithCode called with code:",
      code?.substring(0, 20) + "...",
    );

    const redirectURI = process.env.SCALEKIT_REDIRECT_URI;
    console.log("[AUTH] redirectURI:", redirectURI);

    if (!redirectURI) {
      return { success: false, error: "SCALEKIT_REDIRECT_URI not set" };
    }

    let authResult;
    try {
      authResult = await scaleKit.authenticateWithCode(code, redirectURI);
    } catch (error) {
      console.error("[AUTH] Scalekit authenticateWithCode error:", error);
      return { success: false, error: "Scalekit authentication failed" };
    }

    console.log("[AUTH] authResult:", authResult);

    if (!authResult) {
      return {
        success: false,
        error: "Authentication failed - no result from Scalekit",
      };
    }

    const { user, idToken } = authResult;
    console.log("[AUTH] user from Scalekit:", user);

    let claims;
    try {
      claims = await scaleKit.validateToken(idToken);
      console.log("[AUTH] claims:", claims);
    } catch (error) {
      console.error("[AUTH] validateToken error:", error);
      return { success: false, error: "Token validation failed" };
    }

    const organizationId =
      (claims as any).organization_id ||
      (claims as any).org_id ||
      (claims as any).oid ||
      null;

    console.log("[AUTH] organizationId:", organizationId);

    if (!organizationId) {
      return { success: false, error: "No organization ID in token claims" };
    }

    try {
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
    } catch (error) {
      console.error("Failed to upsert user:", error);
      return { success: false, error: "Failed to save user" };
    }

    const session: UserSession = {
      email: user.email,
      organization_id: organizationId,
    };

    console.log("[AUTH] Session created successfully:", session);
    return { success: true, session };
  },

  getSessionCookieOptions() {
    return {
      httpOnly: true,
      secure: true,
      // sameSite: "none",
      maxAge: 60 * 60 * 24 * 1,
    };
  },
};
