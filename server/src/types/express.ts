import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    email: string;
    organization_id: string;
  };
}
