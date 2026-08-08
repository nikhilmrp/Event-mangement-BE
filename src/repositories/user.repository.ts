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

  async findByRole(role: UserRole, emailVerified?: boolean): Promise<User[]> {
    const where: { role: UserRole; email_verified?: boolean } = { role };
    if (emailVerified !== undefined) {
      where.email_verified = emailVerified;
    }
    return await User.findAll({ where });
  }

  async findByIds(ids: number[]): Promise<User[]> {
    if (!ids.length) return [];
    return await User.findAll({ where: { id: { [Op.in]: ids } } });
  }

  async updateById(id: number, data: Partial<{ email_verified: boolean }>): Promise<void> {
    await User.update(data, { where: { id } });
  }
}

export default new UserRepository();
