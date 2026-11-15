import { UserRole } from "@models/User.model";
import earningsService from "@services/earnings.service";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { Request, Response } from "express";

class EarningsController {
  getMyEarnings = asyncHandler(async (req: Request, res: Response) => {
    const earnings = await earningsService.getMyEarnings(req.user!);
    res.json(new ApiResponse(200, earnings, "Earnings fetched successfully"));
  });

  getEarningsList = asyncHandler(async (req: Request, res: Response) => {
    const role = req.query.role as UserRole;
    if (role !== UserRole.AGENT && role !== UserRole.VENDOR) {
      throw ApiError.badRequest("Role must be agent or vendor");
    }
    const searchParam = req.query.search;
    const search =
      typeof searchParam === "string" && searchParam.trim() !== "" ? searchParam.trim() : undefined;

    const earnings = await earningsService.getEarningsList(role, search);
    res.json(new ApiResponse(200, earnings, "Earnings fetched successfully"));
  });
}

export default new EarningsController();
