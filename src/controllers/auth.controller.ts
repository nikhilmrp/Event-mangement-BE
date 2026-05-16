import { LoginDto, RegisterAdminDto } from "@dto/auth.dto";
import authService from "@services/auth.service";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { AUTH_COOKIE_NAME, getAuthCookieClearOptions, getAuthCookieOptions } from "@utils/cookie";
import logger from "@utils/logger";
import { Request, Response } from "express";

class AuthController {
  registerAdmin = asyncHandler(async (req: Request, res: Response) => {
    const data: RegisterAdminDto = req.body;
    const result = await authService.registerAdmin(data);
    logger.info("Admin created successfully");
    res.json(new ApiResponse(201, result, "User created Successfully"));
  });

  adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const data: LoginDto = req.body;
    const { user, token } = await authService.adminLogin(data);

    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    res.json(new ApiResponse(200, { user }, "Admin logged in successfully"));
  });

  adminLogout = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(AUTH_COOKIE_NAME, getAuthCookieClearOptions());
    res.json(new ApiResponse(200, null, "Admin logged out successfully"));
  });
}

export default new AuthController();
