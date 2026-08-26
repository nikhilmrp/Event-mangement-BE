import { PricingType } from "@models/profile/vendor/VendorPricing.model";
import { EventPriority, EventStatus } from "@models/agent/Event.model";
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

export interface VendorBookingResponseDto {
  client: {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    address: string;
    location: IdNameDto;
  };
  event: {
    id: number;
    event_name: string;
    event_priority: EventPriority;
    estimated_budget: number;
    preferred_date: string;
    additional_notes: string | null;
    status: EventStatus;
    total_amount: number;
    payment_receipt_url: string | null;
    confirmed_at: Date | null;
  };
  my_selection: {
    pricing_type: PricingType;
    amount: number;
  };
}
