import Client from "@models/agent/Client.model";
import { Op, Transaction } from "sequelize";

type UpdateClientData = Partial<{
  name: string;
  email: string;
  phone: string;
  address: string;
  location_id: number;
}> & { id: number };

class ClientRepository {
  create = async (
    data: {
      agent_profile_id: number;
      name: string;
      email?: string;
      phone: string;
      address: string;
      location_id: number;
    },
    tx?: Transaction,
  ): Promise<Client> => {
    return Client.create(data, tx ? { transaction: tx } : undefined);
  };

  update = async (data: UpdateClientData, tx?: Transaction): Promise<void> => {
    const { id, ...fields } = data;
    const updateData = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    );
    if (Object.keys(updateData).length === 0) return;
    await Client.update(updateData, { where: { id }, ...(tx ? { transaction: tx } : {}) });
  };

  findById = async (id: number): Promise<Client | null> => {
    return Client.findByPk(id);
  };

  findByAgentProfileId = async (agentProfileId: number): Promise<Client[]> => {
    return Client.findAll({ where: { agent_profile_id: agentProfileId } });
  };

  findAll = async (): Promise<Client[]> => {
    return Client.findAll();
  };

  findByIds = async (ids: number[]): Promise<Client[]> => {
    if (!ids.length) return [];
    return Client.findAll({ where: { id: { [Op.in]: ids } } });
  };
}

export default new ClientRepository();
