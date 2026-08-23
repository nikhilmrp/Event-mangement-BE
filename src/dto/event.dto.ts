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

export interface ConfirmEventDto {
  user_id: number;
  event_id: number;
  payment_receipt_url: string;
}

export interface EventPreviewResponseDto {
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
  vendors: EventVendorSummaryDto[];
}
