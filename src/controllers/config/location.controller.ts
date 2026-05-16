import { CreateLocationDto } from "@dto/config/location.dto";
import locationService from "@services/config/location.service";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import logger from "@utils/logger";
import { Request, Response } from "express";

class LocationController {
  createLocation = asyncHandler(async (req: Request, res: Response) => {
    logger.info("Creating location", req.body);
    const data: CreateLocationDto = req.body;
    const result = await locationService.createLocation(data);
    logger.info("Location created successfully", result);
    res.json(new ApiResponse(200, result, "Location created successfully"));
  });
}

export default new LocationController();
