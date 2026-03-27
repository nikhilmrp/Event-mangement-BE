import { AuthResponseDto, RegisterAdminDto } from "@dto/auth.dto";
import { UserRole } from "@models/User.model";
import userRepository from "@repositories/user.repository";
import ApiError from "@utils/ApiError";
import { generateToken } from "@utils/helpers";

class AuthService {
  async registerAdmin(data: RegisterAdminDto): Promise<AuthResponseDto> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict("User with this email already exists");
    }

    // Create admin user
    const user = await userRepository.create({
      ...data,
      role: UserRole.ADMIN,
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        status: user.status,
      },
      token,
    };
  }
}

export default new AuthService();
