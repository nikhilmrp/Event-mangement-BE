import { RegisterAdminDto } from "@dto/auth.dto";
import authService from "@services/auth.service";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import logger from "@utils/logger";
import { Request, Response } from "express";

class AuthController {
  registerAdmin = asyncHandler(async (req: Request, res: Response) => {
    const data: RegisterAdminDto = req.body;
    const result = await authService.registerAdmin(data);
    logger.info("Admin created successfully");
    res.json(new ApiResponse(201, result, "User created Successfully"));
  });
}

export default new AuthController();
