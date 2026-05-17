export interface RegisterUserDto {
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

export interface AuthUserDto {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

export interface AuthResponseDto {
  user: AuthUserDto;
  token: string;
}

export interface LoginResponseDto {
  user: AuthUserDto;
}



