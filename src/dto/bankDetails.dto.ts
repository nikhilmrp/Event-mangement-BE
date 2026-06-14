export interface CreateBankDetailsDto {
  user_id: number;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  upi_id: string;
  contact_number: string;
}

export interface BankDetailsResponseDto {
  id: number;
  account_holder_name: string;
}