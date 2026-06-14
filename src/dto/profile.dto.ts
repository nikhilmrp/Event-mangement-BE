import { PricingType } from "@models/profile/vendor/VendorPricing.model";

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
  amount: number;
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