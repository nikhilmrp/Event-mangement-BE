import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import AgentProfile from "@models/profile/agent/AgentProfile.model";
import Location from "@models/config/Location.model";

interface ClientAttributes {
  id: number;
  agent_profile_id: number;
  name: string;
  email: string | null;
  phone: string;
  address: string;
  location_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ClientCreationAttributes extends Optional<
  ClientAttributes,
  "id" | "email" | "created_at" | "updated_at"
> {}

class Client
  extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes
{
  public id!: number;
  public agent_profile_id!: number;
  public name!: string;
  public email!: string | null;
  public phone!: string;
  public address!: string;
  public location_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    agent_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AgentProfile,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Location,
        key: "id",
      },
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
    tableName: "clients",
    timestamps: true,
    underscored: true,
  },
);

export default Client;
