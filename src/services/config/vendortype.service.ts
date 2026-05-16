import { CreateVendorTypeDto, VendorTypeResponseDto } from "@dto/config/vendortype.dto";
import vendorTypeRepository from "@repositories/config/vendortype.repository";
import ApiError from "@utils/ApiError";

class VendorTypeService {
  async createVendorType(data: CreateVendorTypeDto): Promise<VendorTypeResponseDto> {
    const existing = await vendorTypeRepository.findByName(data.name);
    if (existing) {
      throw ApiError.conflict("Vendor type with this name already exists");
    }

    const vendorType = await vendorTypeRepository.create(data);
    return {
      id: vendorType.id,
      name: vendorType.name,
      commission_percentage: Number(vendorType.commission_percentage),
      status: vendorType.status,
      created_at: vendorType.created_at,
      updated_at: vendorType.updated_at,
    };
  }
}

export default new VendorTypeService();
