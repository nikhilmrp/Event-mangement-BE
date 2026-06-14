import { CreatePricingDetailsDto, CreateServiceDetailsDto, CreateVendorProfileDto, UploadWorkGalleryDto } from "@dto/profile.dto";
import vendorProfileService from "@services/vendorProfileService";
import ApiResponse from "@utils/ApiResponse";
import logger from "@utils/logger";
import { Request, Response } from "express";

class VendorProfileController {
    async createVendorProfile(req: Request, res: Response) {
        const { business_name, description, address, phone_number, email, user_id, service_locations }: CreateVendorProfileDto = req.body;
        const vendorProfile = await vendorProfileService.createVendorProfile({ business_name, description, address, phone_number, email, user_id, service_locations });
        logger.info("Vendor profile created successfully", vendorProfile);
        res.json(new ApiResponse(201, vendorProfile, "Vendor profile created successfully"));
    }

    async createServiceDetails(req: Request, res: Response) {
        const { user_id, vendor_type_id, vendor_categoryids }: CreateServiceDetailsDto = req.body;
        const serviceDetails = await vendorProfileService.createServiceDetails({ user_id, vendor_type_id, vendor_categoryids });
        logger.info("Service details created successfully", serviceDetails);
        res.json(new ApiResponse(201, serviceDetails, "Service details created successfully"));
    }

    async createPricingDetails(req: Request, res: Response) {
        const { user_id, pricing_details, amount }: CreatePricingDetailsDto = req.body;    
        const pricingDetails = await vendorProfileService.createPricingDetails({ user_id, pricing_details, amount });
        logger.info("Pricing details created successfully", pricingDetails);
        res.json(new ApiResponse(201, pricingDetails, "Pricing details created successfully"));
    }

    async uploadWorkGalleryImages(req: Request, res: Response) {
        const { user_id, image_urls }: UploadWorkGalleryDto = req.body;
        const workGalleryImages = await vendorProfileService.uploadWorkGalleryImages({ user_id, image_urls });
        logger.info("Work gallery images uploaded successfully", workGalleryImages);
        res.json(new ApiResponse(201, workGalleryImages, "Work gallery images uploaded successfully"));
    }
}

export default new VendorProfileController();