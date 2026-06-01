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