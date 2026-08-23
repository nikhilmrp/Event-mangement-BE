import { PricingType } from "@models/profile/vendor/VendorPricing.model";
import { IdNameDto, PricingDetails } from "@dto/profile.dto";

export interface VendorSearchFilterDto {
  location_id: number;
  date: string;
  vendor_type_id?: number;
  vendor_category_id?: number;
}

export interface VendorSearchResultDto {
  vendor_profile_id: number;
  business_name: string;
  description: string;
  address: string;
  phone_number: string;
  email: string;
  vendor_type: IdNameDto | null;
  vendor_categories: IdNameDto[];
  pricing_details: PricingDetails[];
  location_match: boolean;
}

export interface SaveEventVendorSelectionsDto {
  user_id: number;
  event_id: number;
  selections: { vendor_profile_id: number; pricing_type: PricingType }[];
}

export interface EventVendorSummaryDto {
  vendor_profile_id: number;
  business_name: string;
  pricing_type: PricingType;
  amount: number;
}
