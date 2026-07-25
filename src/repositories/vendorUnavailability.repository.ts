import VendorUnavailability from "@models/profile/vendor/VendorUnavailability.model";
import { Transaction } from "sequelize";

class VendorUnavailabilityRepository {
  create = async (
    data: { vendor_profile_id: number; unavailable_date: string },
    tx?: Transaction,
  ): Promise<VendorUnavailability> => {
    return VendorUnavailability.create(data, tx ? { transaction: tx } : undefined);
  };

  findByVendorProfileIdAndDate = async (
    vendor_profile_id: number,
    unavailable_date: string,
  ): Promise<VendorUnavailability | null> => {
    return VendorUnavailability.findOne({ where: { vendor_profile_id, unavailable_date } });
  };

  deleteById = async (id: number, tx?: Transaction): Promise<void> => {
    await VendorUnavailability.destroy({ where: { id }, transaction: tx });
  };

  findByVendorProfileId = async (vendor_profile_id: number): Promise<VendorUnavailability[]> => {
    return VendorUnavailability.findAll({
      where: { vendor_profile_id },
      order: [["unavailable_date", "ASC"]],
    });
  };
}

export default new VendorUnavailabilityRepository();
