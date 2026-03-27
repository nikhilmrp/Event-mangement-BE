import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "@config/database";

export enum UserRole {
  ADMIN = "admin",
  AGENT = "agent",
  VENDOR = "vendor",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  last_login: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "status" | "email_verified" | "last_login"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public first_name!: string;
  public last_name!: string;
  public phone!: string;
  public role!: UserRole;
  public status!: UserStatus;
  public email_verified!: boolean;
  public last_login!: Date | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Instance method to compare password
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Instance method to get public profile
  public toJSON(): any {
    const { password, ...values } = this.get();
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.VENDOR,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      defaultValue: UserStatus.ACTIVE,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

export default User;
