export interface CreateVendorCategoryDto {
  vendor_type_id: number;
  name: string;
  status: boolean;
}

export interface VendorCategoryResponseDto {
  id: number;
  vendor_type_id: number;
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
