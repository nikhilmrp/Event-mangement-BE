import { PricingType } from "@models/profile/vendor/VendorPricing.model";
import { UserStatus } from "@models/User.model";

export interface CreateAgentProfileDto {
  user_id: number;
  address: string;
  service_locations: number[];
}

export interface AgentProfileResponseDto {
  id: number;
  user_id: number;
  address: string;
  service_locations: number[];
}

export interface CreateVendorProfileDto {
  user_id: number;
  business_name: string;
  description: string;
  address: string;
  phone_number: string;
  email: string;
  service_locations: number[];
}

export interface VendorProfileResponseDto {
  id: number;
  user_id: number;
  business_name: string;
  service_locations: number[];
  description: string;
}

export interface CreateServiceDetailsDto {
  user_id: number;
  vendor_type_id: number;
  vendor_categoryids: number[];
}

export interface ServiceDetailsResponseDto {
  id: number;
  vendor_profile_id: number;
  vendor_type_id: number;
  vendor_categoryids: number[];
}

export interface CreatePricingDetailsDto {
  user_id: number;
  pricing_details: Omit<PricingDetails, "id">[];
}

export interface PricingDetails {
  id: number;
  pricing_type: PricingType;
  amount: number;
}

export interface PricingDetailsResponseDto {
  vendor_profile_id: number;
  pricing_Details: PricingDetails[];
}

export interface UploadWorkGalleryDto {
  user_id: number;
  image_urls: string[];
}

export interface WorkGalleryImage {
  id: number;
  image_url: string;
}

export interface UploadWorkGalleryResponseDto {
  vendor_profile_id: number;
  image_urls: WorkGalleryImage[];
}

export interface AddVendorUnavailabilityDto {
  user_id: number;
  unavailable_date: string;
  status: boolean;
}

export interface VendorUnavailabilityDto {
  id: number;
  unavailable_date: string;
}

export interface VendorUnavailabilityListResponseDto {
  vendor_profile_id: number;
  unavailability: VendorUnavailabilityDto[];
}

export interface IdNameDto {
  id: number;
  name: string;
}

export interface BankDetailsFullDto {
  id: number;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  upi_id: string;
  contact_number: string;
}

export interface AgentProfileFullDetailsResponseDto {
  id: number;
  user_id: number;
  address: string;
  profile_step: number;
  profile_completed: boolean;
  service_locations: IdNameDto[];
  bank_details: BankDetailsFullDto | null;
}

export interface VendorProfileFullDetailsResponseDto {
  id: number;
  user_id: number;
  business_name: string;
  description: string;
  address: string;
  phone_number: string;
  email: string;
  profile_step: number;
  profile_completed: boolean;
  vendor_type: IdNameDto | null;
  service_locations: IdNameDto[];
  vendor_categories: IdNameDto[];
  pricing_details: PricingDetails[];
  work_gallery: WorkGalleryImage[];
  bank_details: BankDetailsFullDto | null;
}

export interface ProfileDetailsResponseDto {
  id: number;
  business_name?: string;
  name?: string;
  username: string;
  vendor_type_name?: string;
  vendor_categories?: string[];
  status?: UserStatus;
  email_verified?: boolean;
  locations: string[];
  email: string;
  phone: string;
  createdAt: Date;
}
