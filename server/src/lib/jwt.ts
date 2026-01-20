import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_TTL = "1d";

export interface SessionClaims {
  email: string;
  organization_id: string;
}

export function signSession(payload: SessionClaims): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_TTL,
  });
}

export function verifySession(token: string): SessionClaims | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionClaims;
  } catch {
    return null;
  }
}
