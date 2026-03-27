import { RegisterAdminDto } from "@dto/auth.dto";
import User, { UserRole } from "@models/User.model";

class UserRepository {
  async create(data: RegisterAdminDto & { role: UserRole }): Promise<User> {
    return await User.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }
}

export default new UserRepository();
