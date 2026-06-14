import { PricingDetails } from "@dto/profile.dto";
import VendorPricing, { PricingType } from "@models/profile/vendor/VendorPricing.model";
import { Transaction } from "sequelize";

class VendorPricingRepository {
    create = async (data: {vendor_profile_id: number, pricing_details: Omit<PricingDetails, "id">[], amount: number}, tx?: Transaction): Promise<VendorPricing[]> => {
        return VendorPricing.bulkCreate(data.pricing_details.map((pricing_detail) => ({ vendor_profile_id: data.vendor_profile_id, pricing_type: pricing_detail.pricing_type, amount: data.amount })), { transaction: tx });
    }
}

export default new VendorPricingRepository();
