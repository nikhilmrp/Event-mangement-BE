import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import VendorProfile from "./VendorProfile.model";

interface VendorWorkLinkAttributes {
  id: number;
  vendor_profile_id: number;
  url: string;
  created_at?: Date;
  updated_at?: Date;
}

interface VendorWorkLinkCreationAttributes extends Optional<
  VendorWorkLinkAttributes,
  "id" | "created_at" | "updated_at"
> {}

class VendorWorkLink
  extends Model<VendorWorkLinkAttributes, VendorWorkLinkCreationAttributes>
  implements VendorWorkLinkAttributes
{
  public id!: number;
  public vendor_profile_id!: number;
  public url!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

VendorWorkLink.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vendor_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VendorProfile,
        key: "id",
      },
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "vendor_work_links",
    timestamps: true,
    underscored: true,
  },
);

export default VendorWorkLink;
