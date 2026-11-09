import { EventPriority, EventStatus } from "@models/agent/Event.model";
import { EventVendorSummaryDto } from "@dto/eventVendor.dto";
import { IdNameDto } from "@dto/profile.dto";

export interface CreateEventDto {
  user_id: number;
  client_id: number;
  event_name: string;
  event_priority: EventPriority;
  estimated_budget: number;
  preferred_date: string;
  additional_notes?: string;
}

export interface UpdateEventDto {
  user_id: number;
  event_id: number;
  event_name?: string;
  event_priority?: EventPriority;
  estimated_budget?: number;
  preferred_date?: string;
  additional_notes?: string;
}

export interface EventResponseDto {
  id: number;
  client_id: number;
  agent_profile_id: number;
  event_name: string;
  event_priority: EventPriority;
  estimated_budget: number;
  preferred_date: string;
  additional_notes: string | null;
  status: EventStatus;
  total_amount: number;
}

export interface EventListItemDto {
  id: number;
  event_name: string;
  event_priority: EventPriority;
  estimated_budget: number;
  preferred_date: string;
  status: EventStatus;
  total_amount: number;
  vendors: EventVendorSummaryDto[];
}

export interface AddPaymentReceiptDto {
  user_id: number;
  event_id: number;
  payment_receipt_url: string;
}

export interface EventWithReceiptsResponseDto extends EventResponseDto {
  payment_receipts: string[];
}

export interface EventPreviewResponseDto {
  agent: {
    id: number;
    name: string;
    email: string | null;
    phone: string;
  };
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
    payment_receipts: string[];
    confirmed_at: Date | null;
    completed_at: Date | null;
  };
  vendors: EventVendorSummaryDto[];
}
