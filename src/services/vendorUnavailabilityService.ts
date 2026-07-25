import { AddVendorUnavailabilityDto, VendorUnavailabilityListResponseDto } from "@dto/profile.dto";
import vendorProfileRepository from "@repositories/vendorProfile.repository";
import vendorUnavailabilityRepository from "@repositories/vendorUnavailability.repository";
import ApiError from "@utils/ApiError";

class VendorUnavailabilityService {
  addUnavailability = async (
    data: AddVendorUnavailabilityDto,
  ): Promise<VendorUnavailabilityListResponseDto> => {
    const { user_id, unavailable_date, status } = data;
    const vendorProfile = await vendorProfileRepository.findByUserId(user_id);
    if (!vendorProfile) {
      throw ApiError.notFound("Vendor profile not found");
    }

    const existing = await vendorUnavailabilityRepository.findByVendorProfileIdAndDate(
      vendorProfile.id,
      unavailable_date,
    );

    if (status) {
      if (existing) {
        throw ApiError.conflict("Date already marked as unavailable");
      }
      await vendorUnavailabilityRepository.create({
        vendor_profile_id: vendorProfile.id,
        unavailable_date,
      });
    } else {
      if (!existing) {
        throw ApiError.notFound("Unavailability date not found");
      }
      await vendorUnavailabilityRepository.deleteById(existing.id);
    }

    const unavailability = await vendorUnavailabilityRepository.findByVendorProfileId(
      vendorProfile.id,
    );
    return {
      vendor_profile_id: vendorProfile.id,
      unavailability: unavailability.map((u) => ({
        id: u.id,
        unavailable_date: u.unavailable_date,
      })),
    };
  };

  getUnavailabilityByUserId = async (user_id: number): Promise<VendorUnavailabilityListResponseDto> => {
    const vendorProfile = await vendorProfileRepository.findByUserId(user_id);
    if (!vendorProfile) {
      throw ApiError.notFound("Vendor profile not found");
    }
    const unavailability = await vendorUnavailabilityRepository.findByVendorProfileId(
      vendorProfile.id,
    );
    return {
      vendor_profile_id: vendorProfile.id,
      unavailability: unavailability.map((u) => ({
        id: u.id,
        unavailable_date: u.unavailable_date,
      })),
    };
  };
}

export default new VendorUnavailabilityService();
