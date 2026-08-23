import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import Event from "@models/agent/Event.model";
import VendorProfile from "@models/profile/vendor/VendorProfile.model";
import { PricingType } from "@models/profile/vendor/VendorPricing.model";

interface EventVendorAttributes {
  id: number;
  event_id: number;
  vendor_profile_id: number;
  pricing_type: PricingType;
  amount: number;
  created_at?: Date;
  updated_at?: Date;
}

interface EventVendorCreationAttributes extends Optional<
  EventVendorAttributes,
  "id" | "created_at" | "updated_at"
> {}

class EventVendor
  extends Model<EventVendorAttributes, EventVendorCreationAttributes>
  implements EventVendorAttributes
{
  public id!: number;
  public event_id!: number;
  public vendor_profile_id!: number;
  public pricing_type!: PricingType;
  public amount!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

EventVendor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
    vendor_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VendorProfile,
        key: "id",
      },
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
    tableName: "event_vendors",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["event_id", "vendor_profile_id"],
      },
    ],
  },
);

export default EventVendor;
