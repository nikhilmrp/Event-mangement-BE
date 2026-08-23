import { PricingDetails } from "@dto/profile.dto";
import VendorPricing, { PricingType } from "@models/profile/vendor/VendorPricing.model";
import { Op, Transaction } from "sequelize";

class VendorPricingRepository {
  create = async (
    data: { vendor_profile_id: number; pricing_details: Omit<PricingDetails, "id">[] },
    tx?: Transaction,
  ): Promise<VendorPricing[]> => {
    return VendorPricing.bulkCreate(
      data.pricing_details.map((pricing_detail) => ({
        vendor_profile_id: data.vendor_profile_id,
        pricing_type: pricing_detail.pricing_type,
        amount: pricing_detail.amount,
      })),
      { transaction: tx },
    );
  };

  findByVendorProfileId = async (vendorProfileId: number): Promise<VendorPricing[]> => {
    return VendorPricing.findAll({ where: { vendor_profile_id: vendorProfileId } });
  };

  findByVendorProfileIds = async (vendorProfileIds: number[]): Promise<VendorPricing[]> => {
    if (!vendorProfileIds.length) return [];
    return VendorPricing.findAll({
      where: { vendor_profile_id: { [Op.in]: vendorProfileIds } },
    });
  };
}

export default new VendorPricingRepository();
