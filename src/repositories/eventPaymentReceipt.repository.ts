import EventPaymentReceipt from "@models/agent/EventPaymentReceipt.model";
import { Op, Transaction } from "sequelize";

class EventPaymentReceiptRepository {
  create = async (
    data: { event_id: number; payment_receipt_url: string },
    tx?: Transaction,
  ): Promise<EventPaymentReceipt> => {
    return EventPaymentReceipt.create(data, tx ? { transaction: tx } : undefined);
  };

  findByEventId = async (eventId: number): Promise<EventPaymentReceipt[]> => {
    return EventPaymentReceipt.findAll({
      where: { event_id: eventId },
      order: [["created_at", "ASC"], ["id", "ASC"]],
    });
  };

  findByEventIds = async (eventIds: number[]): Promise<EventPaymentReceipt[]> => {
    if (!eventIds.length) return [];
    return EventPaymentReceipt.findAll({
      where: { event_id: { [Op.in]: eventIds } },
      order: [["created_at", "ASC"], ["id", "ASC"]],
    });
  };
}

export default new EventPaymentReceiptRepository();
