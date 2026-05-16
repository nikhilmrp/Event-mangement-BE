import { CreateVendorCategoryDto } from "@dto/config/vendorcategory.dto";
import vendorCategoryService from "@services/config/vendorcategory.service";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import logger from "@utils/logger";
import { Request, Response } from "express";

class VendorCategoryController {
  createVendorCategory = asyncHandler(async (req: Request, res: Response) => {
    logger.info("Creating vendor category", req.body);
    const data: CreateVendorCategoryDto = req.body;
    const result = await vendorCategoryService.createVendorCategory(data);
    logger.info("Vendor category created successfully", result);
    res.json(new ApiResponse(200, result, "Vendor category created successfully"));
  });
}

export default new VendorCategoryController();
