import { CreateServiceDetailsDto } from "@dto/profile.dto";
import VendorProfileCategory from "@models/profile/vendor/vendorProfileCategory.Model";
import { Op, Transaction } from "sequelize";

class VendorProfileCategoryRepository {
  create = async (
    data: Omit<CreateServiceDetailsDto, "vendor_type_id" | "user_id"> & {
      vendor_profile_id: number;
    },
    tx?: Transaction,
  ): Promise<VendorProfileCategory[]> => {
    return VendorProfileCategory.bulkCreate(
      data.vendor_categoryids.map((categoryId) => ({
        vendor_profile_id: data.vendor_profile_id,
        vendor_category_id: categoryId,
      })),
      { transaction: tx },
    );
  };

  findByVendorProfileId = async (vendorProfileId: number): Promise<VendorProfileCategory[]> => {
    return VendorProfileCategory.findAll({ where: { vendor_profile_id: vendorProfileId } });
  };

  findByVendorProfileIds = async (
    vendorProfileIds: number[],
  ): Promise<VendorProfileCategory[]> => {
    if (!vendorProfileIds.length) return [];
    return VendorProfileCategory.findAll({
      where: { vendor_profile_id: { [Op.in]: vendorProfileIds } },
    });
  };

  findVendorProfileIdsByCategoryIds = async (categoryIds: number[]): Promise<number[]> => {
    if (!categoryIds.length) return [];
    const vendorProfileCategories = await VendorProfileCategory.findAll({
      where: { vendor_category_id: { [Op.in]: categoryIds } },
      attributes: ["vendor_profile_id"],
    });
    return vendorProfileCategories.map(
      (vendorProfileCategory) => vendorProfileCategory.vendor_profile_id,
    );
  };
}

export default new VendorProfileCategoryRepository();
