import Event, { EventPriority, EventStatus } from "@models/agent/Event.model";
import { Op, Transaction } from "sequelize";

type UpdateEventData = Partial<{
  event_name: string;
  event_priority: EventPriority;
  estimated_budget: number;
  preferred_date: string;
  additional_notes: string;
}> & { id: number };

class EventRepository {
  create = async (
    data: {
      client_id: number;
      agent_profile_id: number;
      event_name: string;
      event_priority: EventPriority;
      estimated_budget: number;
      preferred_date: string;
      additional_notes?: string;
    },
    tx?: Transaction,
  ): Promise<Event> => {
    return Event.create(data, tx ? { transaction: tx } : undefined);
  };

  update = async (data: UpdateEventData, tx?: Transaction): Promise<void> => {
    const { id, ...fields } = data;
    const updateData = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    );
    if (Object.keys(updateData).length === 0) return;
    await Event.update(updateData, { where: { id }, ...(tx ? { transaction: tx } : {}) });
  };

  findById = async (id: number): Promise<Event | null> => {
    return Event.findByPk(id);
  };

  findByClientId = async (clientId: number): Promise<Event[]> => {
    return Event.findAll({ where: { client_id: clientId } });
  };

  findByAgentProfileId = async (agentProfileId: number): Promise<Event[]> => {
    return Event.findAll({ where: { agent_profile_id: agentProfileId } });
  };

  findAll = async (): Promise<Event[]> => {
    return Event.findAll();
  };

  findFiltered = async (filter: {
    agent_profile_id?: number;
    statuses?: EventStatus[];
  }): Promise<Event[]> => {
    const where: { agent_profile_id?: number; status?: { [Op.in]: EventStatus[] } } = {};
    if (filter.agent_profile_id !== undefined) {
      where.agent_profile_id = filter.agent_profile_id;
    }
    if (filter.statuses?.length) {
      where.status = { [Op.in]: filter.statuses };
    }
    return Event.findAll({ where });
  };

  findByIds = async (ids: number[]): Promise<Event[]> => {
    if (!ids.length) return [];
    return Event.findAll({ where: { id: { [Op.in]: ids } } });
  };

  updateStatusAndTotal = async (
    id: number,
    data: Partial<{ status: EventStatus; total_amount: number }>,
    tx?: Transaction,
  ): Promise<void> => {
    await Event.update(data, { where: { id }, ...(tx ? { transaction: tx } : {}) });
  };

  confirm = async (
    id: number,
    data: { payment_receipt_url: string; confirmed_at: Date },
    tx?: Transaction,
  ): Promise<void> => {
    await Event.update(
      { ...data, status: EventStatus.CONFIRMED },
      { where: { id }, ...(tx ? { transaction: tx } : {}) },
    );
  };
}

export default new EventRepository();
