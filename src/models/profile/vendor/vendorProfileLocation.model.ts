import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface VendorProfileLocationAttributes {
  id: number;
  vendor_profile_id: number;
  location_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface VendorProfileLocationCreationAttributes
  extends Optional<VendorProfileLocationAttributes, "id"> {}

class VendorProfileLocation extends Model<
  VendorProfileLocationAttributes,
  VendorProfileLocationCreationAttributes
> {
  public id!: number;
  public vendor_profile_id!: number;
  public location_id!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

VendorProfileLocation.init(
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
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "vendor_profile_locations",
    timestamps: true,
    underscored: true,
  },
);

export default VendorProfileLocation;
