import vendorUnavailabilityService from "@services/vendorUnavailabilityService";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import logger from "@utils/logger";
import { Request, Response } from "express";

class VendorUnavailabilityController {
  addUnavailability = asyncHandler(async (req: Request, res: Response) => {
    const { unavailable_date, status } = req.body;
    logger.info("Updating vendor unavailability", { user_id: req.user!.id, unavailable_date, status });
    const result = await vendorUnavailabilityService.addUnavailability({
      user_id: req.user!.id,
      unavailable_date,
      status,
    });
    logger.info("Vendor unavailability updated successfully", result);
    res.json(new ApiResponse(200, result, "Vendor unavailability updated successfully"));
  });

  getUnavailabilityByUserId = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw ApiError.badRequest("Invalid user id");
    }
    const result = await vendorUnavailabilityService.getUnavailabilityByUserId(userId);
    logger.info("Vendor unavailability fetched successfully", result);
    res.json(new ApiResponse(200, result, "Vendor unavailability fetched successfully"));
  });
}

export default new VendorUnavailabilityController();
