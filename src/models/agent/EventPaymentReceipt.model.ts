import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import Event from "@models/agent/Event.model";

interface EventPaymentReceiptAttributes {
  id: number;
  event_id: number;
  payment_receipt_url: string;
  created_at?: Date;
  updated_at?: Date;
}

interface EventPaymentReceiptCreationAttributes extends Optional<
  EventPaymentReceiptAttributes,
  "id" | "created_at" | "updated_at"
> {}

class EventPaymentReceipt
  extends Model<EventPaymentReceiptAttributes, EventPaymentReceiptCreationAttributes>
  implements EventPaymentReceiptAttributes
{
  public id!: number;
  public event_id!: number;
  public payment_receipt_url!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

EventPaymentReceipt.init(
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
    payment_receipt_url: {
      type: DataTypes.STRING(500),
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
    tableName: "event_payment_receipts",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["event_id"],
      },
    ],
  },
);

export default EventPaymentReceipt;
