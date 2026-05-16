import { CreateVendorTypeDto } from "@dto/config/vendortype.dto";
import VendorType from "@models/config/VendorType.model";

class VendorTypeRepository {
  async findById(id: number): Promise<VendorType | null> {
    return VendorType.findByPk(id);
  }

  async findByName(name: string): Promise<VendorType | null> {
    return VendorType.findOne({ where: { name } });
  }

  async create(data: CreateVendorTypeDto): Promise<VendorType> {
    return VendorType.create(data);
  }
}

export default new VendorTypeRepository();
