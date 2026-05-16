import { CookieOptions } from "express";

export const AUTH_COOKIE_NAME = "access_token";

const parseJwtExpireToMs = (expire: string): number => {
  const match = expire.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = parseInt(match[1], 10);
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[match[2]];
};

export const getAuthCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseJwtExpireToMs(process.env.JWT_EXPIRES_IN || "1h"),
    path: "/",
  };
};

export const getAuthCookieClearOptions = (): CookieOptions => {
  const { maxAge: _, ...options } = getAuthCookieOptions();
  return options;
};
