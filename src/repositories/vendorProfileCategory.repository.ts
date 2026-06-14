import { CreateServiceDetailsDto } from "@dto/profile.dto";
import VendorProfileCategory from "@models/profile/vendor/vendorProfileCategory.Model";
import { Transaction } from "sequelize";

class VendorProfileCategoryRepository {
    create = async (data: Omit<CreateServiceDetailsDto,"vendor_type_id" | "user_id">&{vendor_profile_id: number}, tx?: Transaction): Promise<VendorProfileCategory[]> => {
        return VendorProfileCategory.bulkCreate(data.vendor_categoryids.map((categoryId) => ({ vendor_profile_id: data.vendor_profile_id, vendor_category_id: categoryId })), { transaction: tx });
    } 

    findByVendorProfileId = async (vendorProfileId: number): Promise<VendorProfileCategory[]> => {
        return VendorProfileCategory.findAll({ where: { vendor_profile_id: vendorProfileId } });
    }
}

export default new VendorProfileCategoryRepository();