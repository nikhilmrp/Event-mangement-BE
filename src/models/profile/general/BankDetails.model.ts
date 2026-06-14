import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface BankDetailsAttributes {
  id: number;
  user_id: number;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  upi_id: string;
  contact_number: string;
  created_at?: Date;
  updated_at?: Date;
}

interface BankDetailsCreationAttributes extends Optional<BankDetailsAttributes, "id"> {}

class BankDetails extends Model<BankDetailsAttributes, BankDetailsCreationAttributes> {
  public id!: number;
  public user_id!: number;
  public bank_name!: string;
  public account_holder_name!: string;
  public account_number!: string;
  public ifsc_code!: string;
  public branch_name!: string;
  public upi_id!: string;
  public contact_number!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

BankDetails.init(
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
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_holder_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    upi_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "bank_details",
    timestamps: true,
    underscored: true,
  },
);

export default BankDetails; 