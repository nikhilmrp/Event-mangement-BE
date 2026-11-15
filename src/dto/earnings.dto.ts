export interface MyEarningsResponseDto {
  profile_id: number;
  total_earnings: number;
  completed_events: number;
}

export interface EarningsListItemDto {
  profile_id: number;
  user_id: number;
  name: string;
  email: string | null;
  phone: string;
  business_name?: string;
  total_earnings: number;
  completed_events: number;
}
