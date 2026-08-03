import { UserRole } from "@models/User.model";
import profileDetailsService from "@services/general/profileDetails.service";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { Request, Response } from "express";

class ProfileDetailsController {
  getProfileDetails = asyncHandler(async (req: Request, res: Response) => {
    const role = req.query.role as UserRole;
    if (!Object.values(UserRole).includes(role)) {
      throw ApiError.badRequest("Invalid role");
    }

    const profileDetails = await profileDetailsService.getProfileDetails(role);
    res.json(new ApiResponse(200, profileDetails, "Profile details fetched successfully"));
  });

  getProfileDetailsById = asyncHandler(async (req: Request, res: Response) => {
    const profileId = Number(req.params.profileId);
    if (isNaN(profileId)) {
      throw ApiError.badRequest("Invalid profile id");
    }
    const role = req.query.role as UserRole;
    if (!Object.values(UserRole).includes(role)) {
      throw ApiError.badRequest("Invalid role");
    }
    const result = await profileDetailsService.getProfileDetailsById(profileId, role);
    res.json(new ApiResponse(200, result, "Profile details fetched successfully"));
  });
}

export default new ProfileDetailsController();
