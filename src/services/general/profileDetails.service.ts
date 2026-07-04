import { ProfileDetailsResponseDto } from "@dto/profile.dto";
import { UserRole } from "@models/User.model";
import agentProfileLocationRepository from "@repositories/agentProfileLocation.repository";
import agentProfileRepository from "@repositories/agentProfile.repository";
import locationRepository from "@repositories/config/location.repository";
import vendorCategoryRepository from "@repositories/config/vendorcategory.repository";
import vendorTypeRepository from "@repositories/config/vendortype.repository";
import userRepository from "@repositories/user.repository";
import vendorProfileCategoryRepository from "@repositories/vendorProfileCategory.repository";
import vendorProfileLocationRepository from "@repositories/vendorProfileLocation.repository";
import vendorProfileRepository from "@repositories/vendorProfile.repository";

class ProfileDetailsService {
  getProfileDetails = async (role: UserRole): Promise<ProfileDetailsResponseDto[]> => {
    if (role === UserRole.VENDOR) {
      return this.getVendorProfileDetails();
    }
    if (role === UserRole.AGENT) {
      return this.getAgentProfileDetails();
    }
    return this.getAdminProfileDetails();
  };

  private getVendorProfileDetails = async (): Promise<ProfileDetailsResponseDto[]> => {
    const vendorProfiles = await vendorProfileRepository.findAll();
    const vendorProfileIds = vendorProfiles.map((vendorProfile) => vendorProfile.id);
    const vendorTypeIds = [
      ...new Set(
        vendorProfiles
          .map((vendorProfile) => vendorProfile.vendor_type_id)
          .filter((vendorTypeId): vendorTypeId is number => vendorTypeId !== null),
      ),
    ];
    const [locationNamesByProfileId, categoryNamesByProfileId, users, vendorTypes] =
      await Promise.all([
        this.getLocationNamesByVendorProfileIds(vendorProfileIds),
        this.getCategoryNamesByVendorProfileIds(vendorProfileIds),
        userRepository.findByIds(vendorProfiles.map((vendorProfile) => vendorProfile.user_id)),
        vendorTypeRepository.findByIds(vendorTypeIds),
      ]);
    const userById = new Map(users.map((user) => [user.id, user]));
    const vendorTypeNameById = new Map(
      vendorTypes.map((vendorType) => [vendorType.id, vendorType.name]),
    );

    return vendorProfiles.map((vendorProfile) => {
      const user = userById.get(vendorProfile.user_id);
      return {
        id: vendorProfile.id,
        business_name: vendorProfile.business_name,
        username: user ? `${user.first_name} ${user.last_name}` : "",
        vendor_type_name: vendorProfile.vendor_type_id
          ? (vendorTypeNameById.get(vendorProfile.vendor_type_id) ?? "")
          : "",
        vendor_categories: categoryNamesByProfileId.get(vendorProfile.id) ?? [],
        status: user?.status,
        locations: locationNamesByProfileId.get(vendorProfile.id) ?? [],
        email: vendorProfile.email,
        phone: vendorProfile.phone_number,
        email_verified: user?.email_verified,
        createdAt: vendorProfile.created_at,
      };
    });
  };

  private getAgentProfileDetails = async (): Promise<ProfileDetailsResponseDto[]> => {
    const agentProfiles = await agentProfileRepository.findAll();
    const agentProfileIds = agentProfiles.map((agentProfile) => agentProfile.id);
    const [locationNamesByProfileId, users] = await Promise.all([
      this.getLocationNamesByAgentProfileIds(agentProfileIds),
      userRepository.findByIds(agentProfiles.map((agentProfile) => agentProfile.user_id)),
    ]);
    const userById = new Map(users.map((user) => [user.id, user]));

    return agentProfiles.map((agentProfile) => {
      const user = userById.get(agentProfile.user_id);
      return {
        id: agentProfile.id,
        username: user ? `${user.first_name} ${user.last_name}` : "",
        status: user?.status,
        locations: locationNamesByProfileId.get(agentProfile.id) ?? [],
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        email_verified: user?.email_verified,
        createdAt: agentProfile.created_at,
      };
    });
  };

  private getAdminProfileDetails = async (): Promise<ProfileDetailsResponseDto[]> => {
    const admins = await userRepository.findByRole(UserRole.ADMIN);

    return admins.map((admin) => {
      const fullName = `${admin.first_name} ${admin.last_name}`;
      return {
        id: admin.id,
        name: fullName,
        username: fullName,
        locations: [],
        email: admin.email,
        phone: admin.phone,
        createdAt: admin.created_at,
      };
    });
  };

  private getLocationNamesByVendorProfileIds = async (
    vendorProfileIds: number[],
  ): Promise<Map<number, string[]>> => {
    const vendorProfileLocations =
      await vendorProfileLocationRepository.findByVendorProfileIds(vendorProfileIds);
    const locationById = await this.getLocationNameById(
      vendorProfileLocations.map((vendorProfileLocation) => vendorProfileLocation.location_id),
    );

    const locationNamesByProfileId = new Map<number, string[]>();
    for (const vendorProfileLocation of vendorProfileLocations) {
      const names = locationNamesByProfileId.get(vendorProfileLocation.vendor_profile_id) ?? [];
      const locationName = locationById.get(vendorProfileLocation.location_id);
      if (locationName) names.push(locationName);
      locationNamesByProfileId.set(vendorProfileLocation.vendor_profile_id, names);
    }
    return locationNamesByProfileId;
  };

  private getLocationNamesByAgentProfileIds = async (
    agentProfileIds: number[],
  ): Promise<Map<number, string[]>> => {
    const agentProfileLocations =
      await agentProfileLocationRepository.findByAgentProfileIds(agentProfileIds);
    const locationById = await this.getLocationNameById(
      agentProfileLocations.map((agentProfileLocation) => agentProfileLocation.location_id),
    );

    const locationNamesByProfileId = new Map<number, string[]>();
    for (const agentProfileLocation of agentProfileLocations) {
      const names = locationNamesByProfileId.get(agentProfileLocation.agent_profile_id) ?? [];
      const locationName = locationById.get(agentProfileLocation.location_id);
      if (locationName) names.push(locationName);
      locationNamesByProfileId.set(agentProfileLocation.agent_profile_id, names);
    }
    return locationNamesByProfileId;
  };

  private getLocationNameById = async (locationIds: number[]): Promise<Map<number, string>> => {
    const uniqueLocationIds = [...new Set(locationIds)];
    const locations = await locationRepository.findByIds(uniqueLocationIds);
    return new Map(locations.map((location) => [location.id, location.name]));
  };

  private getCategoryNamesByVendorProfileIds = async (
    vendorProfileIds: number[],
  ): Promise<Map<number, string[]>> => {
    const vendorProfileCategories =
      await vendorProfileCategoryRepository.findByVendorProfileIds(vendorProfileIds);
    const categoryIds = [
      ...new Set(
        vendorProfileCategories.map(
          (vendorProfileCategory) => vendorProfileCategory.vendor_category_id,
        ),
      ),
    ];
    const categories = await vendorCategoryRepository.findByIds(categoryIds);
    const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

    const categoryNamesByProfileId = new Map<number, string[]>();
    for (const vendorProfileCategory of vendorProfileCategories) {
      const names = categoryNamesByProfileId.get(vendorProfileCategory.vendor_profile_id) ?? [];
      const categoryName = categoryNameById.get(vendorProfileCategory.vendor_category_id);
      if (categoryName) names.push(categoryName);
      categoryNamesByProfileId.set(vendorProfileCategory.vendor_profile_id, names);
    }
    return categoryNamesByProfileId;
  };
}

export default new ProfileDetailsService();
