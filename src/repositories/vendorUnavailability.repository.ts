import VendorUnavailability from "@models/profile/vendor/VendorUnavailability.model";
import { Op, Transaction } from "sequelize";

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

  findByVendorProfileIdsAndDate = async (
    vendor_profile_ids: number[],
    unavailable_date: string,
  ): Promise<VendorUnavailability[]> => {
    if (!vendor_profile_ids.length) return [];
    return VendorUnavailability.findAll({
      where: { vendor_profile_id: { [Op.in]: vendor_profile_ids }, unavailable_date },
    });
  };
}

export default new VendorUnavailabilityRepository();
