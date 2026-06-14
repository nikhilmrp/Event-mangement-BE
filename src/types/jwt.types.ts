import { UserRole } from "@models/User.model";

export interface JWTPayload {
  id: number;
  email: string;
  role: UserRole;
}
