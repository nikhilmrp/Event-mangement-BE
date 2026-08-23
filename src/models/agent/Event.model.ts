import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import Client from "@models/agent/Client.model";
import AgentProfile from "@models/profile/agent/AgentProfile.model";

export enum EventPriority {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
}

export enum EventStatus {
  DRAFT = "draft",
  VENDOR_SELECTED = "vendor_selected",
  CONFIRMED = "confirmed",
}

interface EventAttributes {
  id: number;
  client_id: number;
  agent_profile_id: number;
  event_name: string;
  event_priority: EventPriority;
  estimated_budget: number;
  preferred_date: string;
  additional_notes: string | null;
  status: EventStatus;
  total_amount: number;
  payment_receipt_url: string | null;
  confirmed_at: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

interface EventCreationAttributes extends Optional<
  EventAttributes,
  | "id"
  | "additional_notes"
  | "status"
  | "total_amount"
  | "payment_receipt_url"
  | "confirmed_at"
  | "created_at"
  | "updated_at"
> {}

class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public client_id!: number;
  public agent_profile_id!: number;
  public event_name!: string;
  public event_priority!: EventPriority;
  public estimated_budget!: number;
  public preferred_date!: string;
  public additional_notes!: string | null;
  public status!: EventStatus;
  public total_amount!: number;
  public payment_receipt_url!: string | null;
  public confirmed_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
    },
    agent_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AgentProfile,
        key: "id",
      },
    },
    event_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    event_priority: {
      type: DataTypes.ENUM(...Object.values(EventPriority)),
      allowNull: false,
    },
    estimated_budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    preferred_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    additional_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EventStatus)),
      allowNull: false,
      defaultValue: EventStatus.DRAFT,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    payment_receipt_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    confirmed_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "events",
    timestamps: true,
    underscored: true,
  },
);

export default Event;
