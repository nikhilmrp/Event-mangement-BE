import VendorProfileLocation from "@models/profile/vendor/vendorProfileLocation.model";
import { Op, Transaction } from "sequelize";

class VendorProfileLocationRepository {
  bulkCreateForVendorProfile = async (
    vendorProfileId: number,
    locationIds: number[],
    tx?: Transaction,
  ): Promise<VendorProfileLocation[]> => {
    if (!locationIds.length) return [];
    return VendorProfileLocation.bulkCreate(
      locationIds.map((locationId) => ({
        vendor_profile_id: vendorProfileId,
        location_id: locationId,
      })),
      tx ? { transaction: tx } : undefined,
    );
  };

  findByVendorProfileIds = async (
    vendorProfileIds: number[],
  ): Promise<VendorProfileLocation[]> => {
    if (!vendorProfileIds.length) return [];
    return VendorProfileLocation.findAll({
      where: { vendor_profile_id: { [Op.in]: vendorProfileIds } },
    });
  };
}

export default new VendorProfileLocationRepository();
