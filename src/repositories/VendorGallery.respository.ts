import VendorGallery from "@models/profile/vendor/VendorGallery.modal";
import { Transaction } from "sequelize";

class VendorGalleryRepository {
  bulkCreate = async (
    data: { vendor_profile_id: number; image_url: string }[],
    tx?: Transaction,
  ): Promise<VendorGallery[]> => {
    return VendorGallery.bulkCreate(data, tx ? { transaction: tx } : undefined);
  };
}

export default new VendorGalleryRepository();
