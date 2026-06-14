import { CreateBankDetailsDto } from "@dto/bankDetails.dto";
import { UserRole } from "@models/User.model";
import agentProfileRepository from "@repositories/agentProfile.repository";
import bankDetailsService from "@services/general/bankDetails.service";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { Request, Response } from "express";

class BankDetailsController {
  createBankDetails = asyncHandler(async (req: Request, res: Response) => {
    const { user_id, bank_name, account_holder_name, account_number, ifsc_code, branch_name, upi_id, contact_number }: CreateBankDetailsDto = req.body;
    const bankDetails = await bankDetailsService.createBankDetails(req.user?.role as UserRole, { user_id, bank_name, account_holder_name, account_number, ifsc_code, branch_name, upi_id, contact_number });
    res.json(new ApiResponse(201, bankDetails, "Bank details created successfully"));
  });
}

export default new BankDetailsController();