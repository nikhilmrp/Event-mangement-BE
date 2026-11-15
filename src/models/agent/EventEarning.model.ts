import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import Event from "@models/agent/Event.model";
import EventVendor from "@models/agent/EventVendor.model";
import AgentProfile from "@models/profile/agent/AgentProfile.model";
import VendorProfile from "@models/profile/vendor/VendorProfile.model";
import VendorType from "@models/config/VendorType.model";

// One row per event vendor, written when an admin completes the event.
// Commission % and the split are snapshotted so later vendor-type edits
// don't change historical earnings.
interface EventEarningAttributes {
  id: number;
  event_id: number;
  event_vendor_id: number;
  agent_profile_id: number;
  vendor_profile_id: number;
  vendor_type_id: number;
  gross_amount: number;
  commission_percentage: number;
  agent_amount: number;
  admin_amount: number;
  vendor_amount: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface EventEarningCreationAttributes extends Optional<
  EventEarningAttributes,
  "id" | "created_at" | "updated_at"
> {}

class EventEarning
  extends Model<EventEarningAttributes, EventEarningCreationAttributes>
  implements EventEarningAttributes
{
  public id!: number;
  public event_id!: number;
  public event_vendor_id!: number;
  public agent_profile_id!: number;
  public vendor_profile_id!: number;
  public vendor_type_id!: number;
  public gross_amount!: number;
  public commission_percentage!: number;
  public agent_amount!: number;
  public admin_amount!: number;
  public vendor_amount!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

EventEarning.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
    event_vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EventVendor,
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
    vendor_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VendorProfile,
        key: "id",
      },
    },
    vendor_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: VendorType,
        key: "id",
      },
    },
    gross_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    commission_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    agent_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    admin_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    vendor_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
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
    tableName: "event_earnings",
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ["event_vendor_id"] },
      { fields: ["agent_profile_id"] },
      { fields: ["vendor_profile_id"] },
    ],
  },
);

export default EventEarning;
