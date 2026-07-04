import { CreateVendorProfileDto } from "@dto/profile.dto";
import VendorProfile from "@models/profile/vendor/VendorProfile.model";
import { Transaction } from "sequelize";

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

  findAll = async (): Promise<VendorProfile[]> => {
    return VendorProfile.findAll({ where: { profile_completed: true } });
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
