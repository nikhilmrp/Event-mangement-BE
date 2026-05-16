export interface CreateVendorTypeDto {
  name: string;
  commission_percentage: number;
  status: boolean;
}

export interface VendorTypeResponseDto {
  id: number;
  name: string;
  commission_percentage: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
