export interface CreateLocationDto {
  name: string;
  status: boolean;
}

export interface LocationResponseDto {
  id: number;
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
