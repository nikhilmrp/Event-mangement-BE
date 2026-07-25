import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface VendorUnavailabilityAttributes {
  id: number;
  vendor_profile_id: number;
  unavailable_date: string;
  created_at?: Date;
  updated_at?: Date;
}

interface VendorUnavailabilityCreationAttributes extends Optional<
  VendorUnavailabilityAttributes,
  "id" | "created_at" | "updated_at"
> {}

class VendorUnavailability
  extends Model<VendorUnavailabilityAttributes, VendorUnavailabilityCreationAttributes>
  implements VendorUnavailabilityAttributes
{
  public id!: number;
  public vendor_profile_id!: number;
  public unavailable_date!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

VendorUnavailability.init(
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
    unavailable_date: {
      type: DataTypes.DATEONLY,
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
    tableName: "vendor_unavailability",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["vendor_profile_id", "unavailable_date"],
      },
    ],
  },
);

export default VendorUnavailability;
