import { CreateVendorCategoryDto } from "@dto/config/vendorcategory.dto";
import VendorCategory from "@models/config/VendorCategory.model";

class VendorCategoryRepository {
  async findByVendorTypeAndName(
    vendorTypeId: number,
    name: string,
  ): Promise<VendorCategory | null> {
    return VendorCategory.findOne({
      where: { vendor_type_id: vendorTypeId, name },
    });
  }

  async create(data: CreateVendorCategoryDto): Promise<VendorCategory> {
    return VendorCategory.create(data);
  }

  async findByVendorType(vendorTypeId: number): Promise<VendorCategory[]> {
    return VendorCategory.findAll({ where: { vendor_type_id: vendorTypeId, status: true } });
  }
}

export default new VendorCategoryRepository();
