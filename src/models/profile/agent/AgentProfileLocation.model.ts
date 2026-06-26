import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface AgentProfileLocationAttributes {
  id: number;
  agent_profile_id: number;
  location_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface AgentProfileLocationCreationAttributes extends Optional<
  AgentProfileLocationAttributes,
  "id"
> {}

class AgentProfileLocation extends Model<
  AgentProfileLocationAttributes,
  AgentProfileLocationCreationAttributes
> {
  public id!: number;
  public agent_profile_id!: number;
  public location_id!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

AgentProfileLocation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    agent_profile_id: {
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
    tableName: "agent_profile_locations",
    timestamps: true,
    underscored: true,
  },
);

export default AgentProfileLocation;
