import {
  CreateVendorCategoryDto,
  VendorCategoryResponseDto,
} from "@dto/config/vendorcategory.dto";
import vendorCategoryRepository from "@repositories/config/vendorcategory.repository";
import vendorTypeRepository from "@repositories/config/vendortype.repository";
import ApiError from "@utils/ApiError";

class VendorCategoryService {
  async createVendorCategory(
    data: CreateVendorCategoryDto,
  ): Promise<VendorCategoryResponseDto> {
    const vendorType = await vendorTypeRepository.findById(data.vendor_type_id);
    if (!vendorType) {
      throw ApiError.notFound("Vendor type not found");
    }

    const existing = await vendorCategoryRepository.findByVendorTypeAndName(
      data.vendor_type_id,
      data.name,
    );
    if (existing) {
      throw ApiError.conflict("Category with this name already exists for this vendor type");
    }

    const category = await vendorCategoryRepository.create(data);
    return {
      id: category.id,
      vendor_type_id: category.vendor_type_id,
      name: category.name,
      status: category.status,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  async getVendorCategoriesByVendorTypeId(vendorTypeId: number): Promise<VendorCategoryResponseDto[]> {
    const categories = await vendorCategoryRepository.findByVendorType(vendorTypeId);

    if (!categories) {
      throw ApiError.notFound("Vendor categories not found");
    }

    return categories.map((category) => {
      return {
        ...category.toJSON(),
        id: category.id,
      };
    });
  }
}

export default new VendorCategoryService();
