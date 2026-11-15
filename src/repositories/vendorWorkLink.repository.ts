import VendorWorkLink from "@models/profile/vendor/VendorWorkLink.model";
import { Transaction } from "sequelize";

class VendorWorkLinkRepository {
  bulkCreate = async (
    data: { vendor_profile_id: number; url: string }[],
    tx?: Transaction,
  ): Promise<VendorWorkLink[]> => {
    return VendorWorkLink.bulkCreate(data, tx ? { transaction: tx } : undefined);
  };

  findByVendorProfileId = async (vendorProfileId: number): Promise<VendorWorkLink[]> => {
    return VendorWorkLink.findAll({ where: { vendor_profile_id: vendorProfileId } });
  };
}

export default new VendorWorkLinkRepository();
