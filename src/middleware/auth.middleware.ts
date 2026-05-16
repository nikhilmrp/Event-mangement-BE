import ApiError from "@utils/ApiError";
import { AUTH_COOKIE_NAME } from "@utils/cookie";
import { verifyToken } from "@utils/helpers";
import { NextFunction, Request, Response } from "express";

const extractToken = (req: Request): string | undefined => {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return undefined;
};

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};
