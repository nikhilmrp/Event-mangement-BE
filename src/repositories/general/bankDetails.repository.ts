import { CreateBankDetailsDto } from "@dto/bankDetails.dto";
import BankDetails from "@models/profile/general/BankDetails.model";

class BankDetailsRepository {
  createBankDetails = async (data: CreateBankDetailsDto): Promise<BankDetails> => {
    const bankDetails = await BankDetails.create(data);
    return bankDetails;
  };

  findByUserId = async (user_id: number): Promise<BankDetails | null> => {
    return await BankDetails.findOne({ where: { user_id } });
  };
}

export default new BankDetailsRepository();
