import sequelize from "@config/database";
import {
    CreatePricingDetailsDto,
    CreateServiceDetailsDto,
    CreateVendorProfileDto,
    PricingDetailsResponseDto,
    ServiceDetailsResponseDto,
    UploadWorkGalleryDto,
    UploadWorkGalleryResponseDto,
    VendorProfileResponseDto,
} from "@dto/profile.dto";
import locationRepository from "@repositories/config/location.repository";
import vendorcategoryRepository from "@repositories/config/vendorcategory.repository";
import vendortypeRepository from "@repositories/config/vendortype.repository";
import VendorGalleryRespository from "@repositories/VendorGallery.respository";
import vendorPricingRepository from "@repositories/vendorPricing.repository";
import vendorProfileRepository from "@repositories/vendorProfile.repository";
import vendorProfileCategoryRepository from "@repositories/vendorProfileCategory.repository";
import VendorProfileLocationRepository from "@repositories/vendorProfileLocation.repository";
import ApiError from "@utils/ApiError";

class VendorProfileService {
    createVendorProfile = async (data: CreateVendorProfileDto): Promise<VendorProfileResponseDto> => {
        const { user_id, business_name, description, address, phone_number, email, service_locations } = data;
        const existingVendorProfile = await vendorProfileRepository.findByUserId(user_id);
        if (existingVendorProfile) {
            throw ApiError.conflict("Vendor profile already exists for this user");
        }
        const locations = await locationRepository.findByIds(service_locations);
        if (locations.length !== service_locations.length) {
            throw ApiError.notFound("Some of the service locations are not found");
        }
        return sequelize.transaction(async (tx) => {
            const vendorProfile = await vendorProfileRepository.create(
                { user_id, business_name, description, address, phone_number, email },
                tx,
            );
            const vendorProfileLocations = await VendorProfileLocationRepository.bulkCreateForVendorProfile(
                vendorProfile.id,
                service_locations,
                tx,
            );
            await vendorProfileRepository.updateProfileStep(user_id, 1, false, tx);
            return {
                id: vendorProfile.id,
                user_id: vendorProfile.user_id,
                business_name: vendorProfile.business_name,
                service_locations: vendorProfileLocations.map((l) => l.location_id),
                description: vendorProfile.description,
            };
        });
    };

    createServiceDetails = async (data: CreateServiceDetailsDto): Promise<Omit<ServiceDetailsResponseDto, "id">> => {
        const { user_id, vendor_type_id, vendor_categoryids } = data;
        const vendorProfile = await vendorProfileRepository.findByUserId(user_id);
        if (!vendorProfile) {
            throw ApiError.notFound("Vendor profile not found");
        }

        const vendorType = await vendortypeRepository.findById(vendor_type_id);

        if (!vendorType) {
            throw ApiError.notFound("Vendor type not found");
        }

        const vendorCategories = await vendorcategoryRepository.findByIds(vendor_categoryids);

        const vendorCategoriesBelongsToVendorType = vendorCategories.every(
            (category) => category.vendor_type_id === vendor_type_id,
        );

        if (!vendorCategoriesBelongsToVendorType) {
            throw ApiError.badRequest("Some of the categories are not belongs to the vendor type");
        }

        if (vendorProfile.profile_step !== 1) {
            throw ApiError.badRequest("Complete business details first");
        }

        const existingServiceDetails = await vendorProfileCategoryRepository.findByVendorProfileId(vendorProfile.id);
        const existingCategoryIdsForUser = existingServiceDetails.map((s) => s.vendor_category_id);
        const alreadyAddedCategoryIds = vendor_categoryids.filter((categoryId) =>
            existingCategoryIdsForUser.includes(categoryId),
        );
        if (alreadyAddedCategoryIds.length > 0) {
            throw ApiError.conflict("Some of the categories are already added");
        }

        return sequelize.transaction(async (tx) => {
            await vendorProfileRepository.update({ vendor_type_id, id: vendorProfile.id }, tx);
            const serviceDetails = await vendorProfileCategoryRepository.create(
                { vendor_profile_id: vendorProfile.id, vendor_categoryids },
                tx,
            );
            await vendorProfileRepository.updateProfileStep(user_id, 2, false, tx);
            return {
                vendor_profile_id: vendorProfile.id,
                vendor_type_id: vendor_type_id,
                vendor_categoryids: serviceDetails.map((s) => s.vendor_category_id),
            };
        });
    };

    createPricingDetails = async (data: CreatePricingDetailsDto): Promise<PricingDetailsResponseDto> => {
        const { user_id, pricing_details, amount } = data;
        const vendorProfile = await vendorProfileRepository.findByUserId(user_id);
        if (!vendorProfile) {
            throw ApiError.notFound("Vendor profile not found");
        }
        if (vendorProfile.profile_step !== 2) {
            throw ApiError.badRequest("Complete service details first");
        }
        return sequelize.transaction(async (tx) => {
            const pricingDetails = await vendorPricingRepository.create(
                { vendor_profile_id: vendorProfile.id, pricing_details, amount },
                tx,
            );
            await vendorProfileRepository.updateProfileStep(user_id, 3, false, tx);
            return {
                vendor_profile_id: vendorProfile.id,
                pricing_Details: pricingDetails.map((p) => ({
                    id: p.id,
                    pricing_type: p.pricing_type,
                    amount: p.amount,
                })),
            };
        });
    };

    uploadWorkGalleryImages = async (data: UploadWorkGalleryDto): Promise<UploadWorkGalleryResponseDto> => {
        const { user_id, image_urls } = data;
        const vendorProfile = await vendorProfileRepository.findByUserId(user_id);
        if (!vendorProfile) {
            throw ApiError.notFound("Vendor profile not found");
        }
        return sequelize.transaction(async (tx) => {
            const workGalleryImages = await VendorGalleryRespository.bulkCreate(
                image_urls.map((image_url) => ({
                    vendor_profile_id: vendorProfile.id,
                    image_url,
                })),
                tx,
            );
            await vendorProfileRepository.updateProfileStep(user_id, 4, false, tx);
            return {
                vendor_profile_id: vendorProfile.id,
                image_urls: workGalleryImages.map((w) => ({
                    id: w.id,
                    image_url: w.image_url,
                })),
            };
        });
    };
}

export default new VendorProfileService();
