import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import VendorType from "@models/config/VendorType.model";

interface VendorCategoryAttributes {
  id: number;
  vendor_type_id: number;
  name: string;
  status: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface VendorCategoryCreationAttributes
  extends Optional<VendorCategoryAttributes, "id" | "status"> {}

class VendorCategory
  extends Model<VendorCategoryAttributes, VendorCategoryCreationAttributes>
  implements VendorCategoryAttributes
{
  public id!: number;
  public vendor_type_id!: number;
  public name!: string;
  public status!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

VendorCategory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    vendor_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: VendorType,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "vendor_categories",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["vendor_type_id", "name"],
      },
    ],
  },
);

VendorCategory.belongsTo(VendorType, { foreignKey: "vendor_type_id", as: "vendorType" });

export default VendorCategory;
