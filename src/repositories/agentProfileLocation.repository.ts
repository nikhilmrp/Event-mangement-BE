import AgentProfileLocation from "@models/profile/agent/AgentProfileLocation.model";
import { Transaction } from "sequelize";

class AgentProfileLocationRepository {
  bulkCreateForAgentProfile = async (
    agentProfileId: number,
    locationIds: number[],
    tx?: Transaction,
  ): Promise<AgentProfileLocation[]> => {
    if (!locationIds.length) return [];

    return AgentProfileLocation.bulkCreate(
      locationIds.map((locationId) => ({
        agent_profile_id: agentProfileId,
        location_id: locationId,
      })),
      tx ? { transaction: tx } : undefined,
    );
  };

  deleteByAgentProfileId = async (agentProfileId: number, tx?: Transaction): Promise<number> => {
    return AgentProfileLocation.destroy({
      where: { agent_profile_id: agentProfileId },
      ...(tx ? { transaction: tx } : {}),
    });
  };
}

export default new AgentProfileLocationRepository();

