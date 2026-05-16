import { CreateVendorTypeDto } from "@dto/config/vendortype.dto";
import vendorTypeService from "@services/config/vendortype.service";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import logger from "@utils/logger";
import { Request, Response } from "express";

class VendorTypeController {
  createVendorType = asyncHandler(async (req: Request, res: Response) => {
    logger.info("Creating vendor type", req.body);
    const data: CreateVendorTypeDto = req.body;
    const result = await vendorTypeService.createVendorType(data);
    logger.info("Vendor type created successfully", result);
    res.json(new ApiResponse(200, result, "Vendor type created successfully"));
  });
}

export default new VendorTypeController();
