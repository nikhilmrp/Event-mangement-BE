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

  findVendorProfileIdsByLocationIds = async (locationIds: number[]): Promise<number[]> => {
    if (!locationIds.length) return [];
    const vendorProfileLocations = await VendorProfileLocation.findAll({
      where: { location_id: { [Op.in]: locationIds } },
      attributes: ["vendor_profile_id"],
    });
    return vendorProfileLocations.map(
      (vendorProfileLocation) => vendorProfileLocation.vendor_profile_id,
    );
  };
}

export default new VendorProfileLocationRepository();
