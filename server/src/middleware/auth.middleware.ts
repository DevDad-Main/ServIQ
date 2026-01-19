import { sendError } from "devdad-express-utils";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    email: string;
    organization_id: string;
  };
  file?: Express.Multer.File;
}

export const isUserAuthorized = async (
  req: Request,
): Promise<AuthRequest["user"] | null> => {
  const userSessionCookie = req.cookies?.user_session;
  let user = null;

  console.log("User Session Cookie:", userSessionCookie);

  if (userSessionCookie) {
    try {
      user = JSON.parse(userSessionCookie) as AuthRequest["user"];
      console.log("User:", user);
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
    return sendError(res, "Unauthorized User", 401);
  }

  (req as AuthRequest).user = user;
  next();
};
