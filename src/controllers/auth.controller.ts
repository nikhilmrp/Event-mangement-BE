import { LoginDto, RegisterUserDto } from "@dto/auth.dto";
import { UserRole } from "@models/User.model";
import authService from "@services/auth.service";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { AUTH_COOKIE_NAME, getAuthCookieClearOptions, getAuthCookieOptions } from "@utils/cookie";
import logger from "@utils/logger";
import { Request, Response } from "express";

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.AGENT]: "Agent",
  [UserRole.VENDOR]: "Vendor",
};

class AuthController {
  private createRegister(role: UserRole) {
    const label = ROLE_LABELS[role];
    return asyncHandler(async (req: Request, res: Response) => {
      const data: RegisterUserDto = req.body;
      const result = await authService.register(data, role);
      logger.info(`${label} created successfully`);
      res.json(new ApiResponse(201, result, `${label} created successfully`));
    });
  }

  private createLogin(role: UserRole) {
    const label = ROLE_LABELS[role];
    return asyncHandler(async (req: Request, res: Response) => {
      const data: LoginDto = req.body;
      const { user, token } = await authService.login(data, role);

      res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
      logger.info(`${label} logged in successfully - ${user.email}`);
      res.json(new ApiResponse(200, { user }, `${label} logged in successfully`));
    });
  }

  private createLogout(role: UserRole) {
    const label = ROLE_LABELS[role];
    return asyncHandler(async (_req: Request, res: Response) => {
      res.clearCookie(AUTH_COOKIE_NAME, getAuthCookieClearOptions());
      logger.info(`${label} logged out successfully`);
      res.json(new ApiResponse(200, null, `${label} logged out successfully`));
    });
  }

  registerAdmin = this.createRegister(UserRole.ADMIN);
  adminLogin = this.createLogin(UserRole.ADMIN);
  adminLogout = this.createLogout(UserRole.ADMIN);

  registerVendor = this.createRegister(UserRole.VENDOR);
  vendorLogin = this.createLogin(UserRole.VENDOR);
  vendorLogout = this.createLogout(UserRole.VENDOR);

  registerAgent = this.createRegister(UserRole.AGENT);
  agentLogin = this.createLogin(UserRole.AGENT);
  agentLogout = this.createLogout(UserRole.AGENT);
}

export default new AuthController();
