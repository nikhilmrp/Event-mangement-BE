import EventVendor from "@models/agent/EventVendor.model";
import { PricingType } from "@models/profile/vendor/VendorPricing.model";
import { Op, Transaction } from "sequelize";

class EventVendorRepository {
  bulkCreateForEvent = async (
    eventId: number,
    rows: { vendor_profile_id: number; pricing_type: PricingType; amount: number }[],
    tx?: Transaction,
  ): Promise<EventVendor[]> => {
    if (!rows.length) return [];
    return EventVendor.bulkCreate(
      rows.map((row) => ({ event_id: eventId, ...row })),
      tx ? { transaction: tx } : undefined,
    );
  };

  deleteByEventId = async (eventId: number, tx?: Transaction): Promise<number> => {
    return EventVendor.destroy({
      where: { event_id: eventId },
      ...(tx ? { transaction: tx } : {}),
    });
  };

  findByEventId = async (eventId: number): Promise<EventVendor[]> => {
    return EventVendor.findAll({ where: { event_id: eventId } });
  };

  findByEventIds = async (eventIds: number[]): Promise<EventVendor[]> => {
    if (!eventIds.length) return [];
    return EventVendor.findAll({ where: { event_id: { [Op.in]: eventIds } } });
  };
}

export default new EventVendorRepository();
