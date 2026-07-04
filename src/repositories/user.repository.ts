import { RegisterUserDto } from "@dto/auth.dto";
import User, { UserRole } from "@models/User.model";
import { Op } from "sequelize";

class UserRepository {
  async create(data: RegisterUserDto & { role: UserRole }): Promise<User> {
    return await User.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async findByUserId(user_id: number): Promise<User | null> {
    return await User.findByPk(user_id);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return await User.findAll({ where: { role } });
  }

  async findByIds(ids: number[]): Promise<User[]> {
    if (!ids.length) return [];
    return await User.findAll({ where: { id: { [Op.in]: ids } } });
  }
}

export default new UserRepository();
