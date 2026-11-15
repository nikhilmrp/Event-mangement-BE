import EventEarning, { EventEarningCreationAttributes } from "@models/agent/EventEarning.model";
import { col, fn, Op, Transaction, WhereOptions } from "sequelize";

export type EarningOwnerField = "agent_profile_id" | "vendor_profile_id";

const AMOUNT_FIELD_BY_OWNER: Record<EarningOwnerField, "agent_amount" | "vendor_amount"> = {
  agent_profile_id: "agent_amount",
  vendor_profile_id: "vendor_amount",
};

export interface EarningTotalRow {
  profile_id: number;
  total_earnings: number;
  completed_events: number;
}

class EventEarningRepository {
  bulkCreate = async (
    rows: EventEarningCreationAttributes[],
    tx?: Transaction,
  ): Promise<EventEarning[]> => {
    if (!rows.length) return [];
    return EventEarning.bulkCreate(rows, tx ? { transaction: tx } : undefined);
  };

  // Totals the agent's or vendor's share per profile. Admin share is never summed here.
  sumByOwner = async (ownerField: EarningOwnerField, ids?: number[]): Promise<EarningTotalRow[]> => {
    if (ids && !ids.length) return [];
    const where: WhereOptions = ids ? { [ownerField]: { [Op.in]: ids } } : {};
    const rows = (await EventEarning.findAll({
      where,
      attributes: [
        [col(ownerField), "profile_id"],
        [fn("SUM", col(AMOUNT_FIELD_BY_OWNER[ownerField])), "total_earnings"],
        [fn("COUNT", fn("DISTINCT", col("event_id"))), "completed_events"],
      ],
      group: [ownerField],
      raw: true,
    })) as unknown as { profile_id: number; total_earnings: string; completed_events: string }[];

    return rows.map((r) => ({
      profile_id: Number(r.profile_id),
      total_earnings: Number(r.total_earnings ?? 0),
      completed_events: Number(r.completed_events ?? 0),
    }));
  };
}

export default new EventEarningRepository();
