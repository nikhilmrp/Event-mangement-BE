import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JWTPayload } from "../types/jwt.types";

export type { JWTPayload };

export const generateToken = (payload: JWTPayload): string => {
  const secret: Secret = process.env.JWT_SECRET || "default-secret";
  const expiresIn = (process.env.JWT_EXPIRE as jwt.SignOptions["expiresIn"]) || "7d";
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET || "default-secret") as JWTPayload;
};

export const excludeFields = <T extends Record<string, any>>(
  obj: T,
  fields: string[],
): Partial<T> => {
  const newObj = { ...obj };
  fields.forEach((field) => delete newObj[field]);
  return newObj;
};
