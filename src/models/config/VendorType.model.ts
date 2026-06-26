import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface VendorTypeAttributes {
  id: number;
  name: string;
  commission_percentage: number;
  status: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface VendorTypeCreationAttributes extends Optional<VendorTypeAttributes, "id" | "status"> {}

class VendorType
  extends Model<VendorTypeAttributes, VendorTypeCreationAttributes>
  implements VendorTypeAttributes
{
  public id!: number;
  public name!: string;
  public commission_percentage!: number;
  public status!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

VendorType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    commission_percentage: {
      type: DataTypes.DECIMAL(5, 2),
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
    tableName: "vendor_types",
    timestamps: true,
  },
);

export default VendorType;
