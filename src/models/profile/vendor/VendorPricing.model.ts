import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

export enum PricingType {
  PER_HOUR = "per_hour",
  PER_DAY = "per_day",
  PER_EVENT = "per_event",
}

interface VendorPricingAttributes {
  id: number;
  vendor_profile_id: number;
  pricing_type: PricingType;
  amount: number;
  created_at?: Date;
  updated_at?: Date;
}

interface VendorPricingCreationAttributes extends Optional<
  VendorPricingAttributes,
  "id" | "created_at" | "updated_at"
> {}

class VendorPricing
  extends Model<VendorPricingAttributes, VendorPricingCreationAttributes>
  implements VendorPricingAttributes
{
  public id!: number;
  public vendor_profile_id!: number;
  public pricing_type!: PricingType;
  public amount!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

VendorPricing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vendor_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pricing_type: {
      type: DataTypes.ENUM(...Object.values(PricingType)),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    tableName: "vendor_pricing",
    timestamps: true,
    underscored: true,
  },
);

export default VendorPricing;
