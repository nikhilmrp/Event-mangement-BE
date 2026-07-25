import { AuthResponseDto, AuthUserDto, LoginDto, RegisterUserDto } from "@dto/auth.dto";
import User, { UserRole } from "@models/User.model";
import agentProfileRepository from "@repositories/agentProfile.repository";
import userRepository from "@repositories/user.repository";
import vendorProfileRepository from "@repositories/vendorProfile.repository";
import ApiError from "@utils/ApiError";
import { generateToken } from "@utils/helpers";

class AuthService {
  private toAuthResponse(
    user: User,
    token: string,
    profile?: { profile_step: number; profile_completed: boolean } | null,
  ): AuthResponseDto {
    const authUser: AuthUserDto = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status,
      email_verified: user.email_verified,
    };

    authUser.profile_step = profile?.profile_step || 0;
    authUser.profile_completed = profile?.profile_completed || false;

    return { user: authUser, token };
  }

  async register(data: RegisterUserDto, role: UserRole): Promise<AuthResponseDto> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict("User with this email already exists");
    }

    const user = await userRepository.create({ ...data, role });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return this.toAuthResponse(user, token);
  }

  async login(data: LoginDto, role: UserRole): Promise<AuthResponseDto> {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    if (user.role !== role) {
      throw ApiError.unauthorized(`You are not authorized to login as a ${role}`);
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid password");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    let profile: { profile_step: number; profile_completed: boolean } | null = null;
    if (role === UserRole.VENDOR) {
      profile = await vendorProfileRepository.findByUserId(user.id);
    } else if (role === UserRole.AGENT) {
      profile = await agentProfileRepository.findByUserId(user.id);
    }

    return this.toAuthResponse(user, token, profile);
  }
}

export default new AuthService();
