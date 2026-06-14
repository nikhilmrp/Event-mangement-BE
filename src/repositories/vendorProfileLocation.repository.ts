import VendorProfileLocation from "@models/profile/vendor/vendorProfileLocation.model";
import { Transaction } from "sequelize";

class VendorProfileLocationRepository {
    bulkCreateForVendorProfile = async (vendorProfileId: number, locationIds: number[], tx?: Transaction): Promise<VendorProfileLocation[]> => {
        if (!locationIds.length) return [];
        return VendorProfileLocation.bulkCreate(locationIds.map((locationId) => ({ vendor_profile_id: vendorProfileId, location_id: locationId })), tx ? { transaction: tx } : undefined);
    }
}

export default new VendorProfileLocationRepository();