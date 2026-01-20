import { sendError } from "devdad-express-utils";
import { Request, Response, NextFunction } from "express";
import { verifySession } from "@/lib/jwt";

export interface AuthRequest extends Request {
  user?: {
    email: string;
    organization_id: string;
  };
  file?: Express.Multer.File;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.user_session;

  if (!token) {
    return sendError(res, "Unauthorized User", 401);
  }

  const session = verifySession(token);

  if (!session) {
    return sendError(res, "Invalid or expired session", 401);
  }

  (req as AuthRequest).user = session;
  next();
};
