import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface AgentProfileAttributes {
  id: number;
  user_id: number;
  address: string;
  profile_step: number;
  profile_completed: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface AgentProfileCreationAttributes
  extends Optional<AgentProfileAttributes, "id" | "profile_completed" | "profile_step" | "user_id"> {}

class AgentProfile extends Model<AgentProfileAttributes, AgentProfileCreationAttributes> {
  public id!: number;
  public user_id!: number;
  public address!: string;
  public profile_step!: number;
  public profile_completed!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}


AgentProfile.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_step: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 2,
      },
    },
    profile_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "agent_profiles",
    timestamps: true,
    underscored: true,
  },
);

export default AgentProfile;    