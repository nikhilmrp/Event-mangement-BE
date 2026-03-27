export interface RegisterAdminDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    status: string;
  };
  token: string;
}
