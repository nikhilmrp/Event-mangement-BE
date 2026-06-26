import { CreateVendorCategoryDto } from "@dto/config/vendorcategory.dto";
import VendorCategory from "@models/config/VendorCategory.model";
import { Op } from "sequelize";

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

  async findByIds(ids: number[]): Promise<VendorCategory[]> {
    return VendorCategory.findAll({
      where: { id: { [Op.in]: ids }, status: true },
      attributes: ["id", "name", "vendor_type_id"],
    });
  }

  async findAll(): Promise<VendorCategory[]> {
    return VendorCategory.findAll();
  }
}

export default new VendorCategoryRepository();
