import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    email: string;
    organization_id: string;
  };
}

export const isUserAuthorized = async (
  req: Request,
): Promise<AuthRequest["user"] | null> => {
  const userSessionCookie = req.cookies?.user_session;
  let user = null;

  if (userSessionCookie) {
    try {
      user = JSON.parse(userSessionCookie) as AuthRequest["user"];
    } catch (error) {
      console.error("Failed to parse user session:", error);
    }
  }

  return user;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = await isUserAuthorized(req);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  (req as AuthRequest).user = user;
  next();
};
