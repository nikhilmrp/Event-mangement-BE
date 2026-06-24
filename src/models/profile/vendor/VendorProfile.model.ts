import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import VendorType from "@models/config/VendorType.model";

interface VendorProfileAttributes {
  id: number;
  user_id: number;
  business_name: string;
  description: string;
  address: string;
  phone_number: string;
  email: string;
  profile_step: number;
  profile_completed: boolean;
  vendor_type_id: number | null;
  created_at?: Date;
  updated_at?: Date;
}

interface VendorProfileCreationAttributes extends Optional<
  VendorProfileAttributes,
  "id" | "profile_completed" | "profile_step" | "user_id" | "vendor_type_id"
> {}

class VendorProfile extends Model<VendorProfileAttributes, VendorProfileCreationAttributes> {
  public id!: number;
  public user_id!: number;
  public business_name!: string;
  public description!: string;
  public address!: string;
  public phone_number!: string;
  public email!: string;
  public profile_step!: number;
  public profile_completed!: boolean;
  public vendor_type_id!: number | null;
  public created_at!: Date;
  public updated_at!: Date;
}

VendorProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_step: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    profile_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    vendor_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: VendorType,
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "vendor_profiles",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id"],
      },
    ],
  },
);

export default VendorProfile;
