import { CreateVendorProfileDto } from "@dto/profile.dto";
import VendorProfile from "@models/profile/vendor/VendorProfile.model";
import { Op, Transaction } from "sequelize";

type UpdateVendorProfileData = Partial<
  Omit<CreateVendorProfileDto, "service_locations" | "user_id"> & {
    profile_step: number;
    profile_completed: boolean;
    vendor_type_id: number;
  }
> & { id: number };

class VendorProfileRepository {
  create = async (
    data: Omit<CreateVendorProfileDto, "service_locations">,
    tx?: Transaction,
  ): Promise<VendorProfile> => {
    return await VendorProfile.create(data, tx ? { transaction: tx } : undefined);
  };
  update = async (data: UpdateVendorProfileData, tx?: Transaction): Promise<void> => {
    const { id, ...fields } = data;
    const updateData = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    );
    if (Object.keys(updateData).length === 0) return;
    await VendorProfile.update(updateData, { where: { id }, ...(tx ? { transaction: tx } : {}) });
  };

  findByUserId = async (user_id: number): Promise<VendorProfile | null> => {
    return VendorProfile.findOne({ where: { user_id } });
  };

  findById = async (id: number): Promise<VendorProfile | null> => {
    return VendorProfile.findByPk(id);
  };

  findAll = async (searchOptions?: {
    search: string;
    matchingUserIds: number[];
    matchingVendorTypeIds: number[];
    matchingProfileIdsFromJoins: number[];
  }): Promise<VendorProfile[]> => {
    const where: { profile_completed: boolean; [Op.or]?: unknown[] } = { profile_completed: true };
    if (searchOptions) {
      const term = `%${searchOptions.search}%`;
      const orConditions: unknown[] = [
        { business_name: { [Op.like]: term } },
        { email: { [Op.like]: term } },
        { phone_number: { [Op.like]: term } },
        { address: { [Op.like]: term } },
        { description: { [Op.like]: term } },
      ];
      if (searchOptions.matchingVendorTypeIds.length) {
        orConditions.push({ vendor_type_id: { [Op.in]: searchOptions.matchingVendorTypeIds } });
      }
      if (searchOptions.matchingUserIds.length) {
        orConditions.push({ user_id: { [Op.in]: searchOptions.matchingUserIds } });
      }
      if (searchOptions.matchingProfileIdsFromJoins.length) {
        orConditions.push({ id: { [Op.in]: searchOptions.matchingProfileIdsFromJoins } });
      }
      where[Op.or] = orConditions;
    }
    return VendorProfile.findAll({ where });
  };

  findApproved = async (vendor_type_id?: number): Promise<VendorProfile[]> => {
    const where: { profile_completed: boolean; vendor_type_id?: number } = {
      profile_completed: true,
    };
    if (vendor_type_id !== undefined) {
      where.vendor_type_id = vendor_type_id;
    }
    return VendorProfile.findAll({ where });
  };

  findByIds = async (ids: number[]): Promise<VendorProfile[]> => {
    if (!ids.length) return [];
    return VendorProfile.findAll({ where: { id: { [Op.in]: ids } } });
  };

  updateProfileStep = async (
    user_id: number,
    profile_step: number,
    profile_completed: boolean,
    tx?: Transaction,
  ): Promise<void> => {
    await VendorProfile.update(
      { profile_step, profile_completed },
      { where: { user_id }, transaction: tx },
    );
  };
}

export default new VendorProfileRepository();
