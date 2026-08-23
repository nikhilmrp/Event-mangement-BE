import { EventListItemDto } from "@dto/event.dto";

export interface CreateClientDto {
  user_id: number;
  agent_id?: number;
  name: string;
  email?: string;
  phone: string;
  address: string;
  location_id: number;
}

export interface UpdateClientDto {
  user_id: number;
  client_id: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  location_id?: number;
}

export interface ClientResponseDto {
  id: number;
  agent_profile_id: number;
  name: string;
  email: string | null;
  phone: string;
  address: string;
  location_id: number;
}

export interface ClientListItemDto {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  address: string;
  location: { id: number; name: string };
  events: EventListItemDto[];
}
