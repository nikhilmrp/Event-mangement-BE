import { BankDetailsResponseDto, CreateBankDetailsDto } from "@dto/bankDetails.dto";
import agentProfileRepository from "@repositories/agentProfile.repository";
import bankDetailsRepository from "@repositories/general/bankDetails.repository";
import { UserRole } from "@models/User.model";
import vendorProfileRepository from "@repositories/vendorProfile.repository";
import userRepository from "@repositories/user.repository";
import ApiError from "@utils/ApiError";

class BankDetailsService {
  createBankDetails = async (role: UserRole, data: CreateBankDetailsDto): Promise<BankDetailsResponseDto> => {
    const { user_id, bank_name, account_holder_name, account_number, ifsc_code, branch_name, upi_id, contact_number } = data;
    const user = await userRepository.findByUserId(user_id);
    if(!user) {
      throw ApiError.notFound("User not found");
    }
    if(user.role !== role) {
      throw ApiError.unauthorized("You are not authorized to create bank details for this user");
    }

    const existingBankDetails = await bankDetailsRepository.findByUserId(user_id);
    if(existingBankDetails) {
      throw ApiError.conflict("Bank details already exist for this user");
    }
    const bankDetails = await bankDetailsRepository.createBankDetails({ user_id, bank_name, account_holder_name, account_number, ifsc_code, branch_name, upi_id, contact_number });
    if(role === UserRole.AGENT) {
      await agentProfileRepository.updateProfileStep(user_id, 2, true);
    }
    if(role === UserRole.VENDOR) {
      await vendorProfileRepository.updateProfileStep(user_id, 5, true);
    }
    return bankDetails;
  };
}

export default new BankDetailsService();