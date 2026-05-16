import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface LocationAttributes {
  id: number;
  name: string;
  status: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface LocationCreationAttributes extends Optional<LocationAttributes, "id"> {}

class Location extends Model<LocationAttributes, LocationCreationAttributes> {
  public id!: number;
  public name!: string;
  public status!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "locations",
    timestamps: true,
  },
);

export default Location;
