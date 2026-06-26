import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface VendorGalleryAttributes {
  id: number;
  vendor_profile_id: number;
  image_url: string;
  created_at?: Date;
  updated_at?: Date;
}

interface VendorGalleryCreationAttributes extends Optional<
  VendorGalleryAttributes,
  "id" | "created_at" | "updated_at"
> {}

class VendorGallery
  extends Model<VendorGalleryAttributes, VendorGalleryCreationAttributes>
  implements VendorGalleryAttributes
{
  public id!: number;
  public vendor_profile_id!: number;
  public image_url!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

VendorGallery.init(
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
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "vendor_gallery",
    timestamps: true,
    underscored: true,
  },
);

export default VendorGallery;
