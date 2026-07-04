import { CreateVendorTypeDto } from "@dto/config/vendortype.dto";
import VendorType from "@models/config/VendorType.model";
import { Op } from "sequelize";

class VendorTypeRepository {
  async findById(id: number): Promise<VendorType | null> {
    return VendorType.findOne({ where: { id, status: true } });
  }

  async findByIds(ids: number[]): Promise<VendorType[]> {
    if (!ids.length) return [];
    return VendorType.findAll({ where: { id: { [Op.in]: ids } } });
  }

  async findByName(name: string): Promise<VendorType | null> {
    return VendorType.findOne({ where: { name } });
  }

  async create(data: CreateVendorTypeDto): Promise<VendorType> {
    return VendorType.create(data);
  }

  async findAllByStatus(status: boolean): Promise<VendorType[]> {
    return VendorType.findAll({ where: { status } });
  }
}

export default new VendorTypeRepository();
