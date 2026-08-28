import AgentProfileLocation from "@models/profile/agent/AgentProfileLocation.model";
import { Op, Transaction } from "sequelize";

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

  findByAgentProfileIds = async (agentProfileIds: number[]): Promise<AgentProfileLocation[]> => {
    if (!agentProfileIds.length) return [];
    return AgentProfileLocation.findAll({
      where: { agent_profile_id: { [Op.in]: agentProfileIds } },
    });
  };

  findAgentProfileIdsByLocationIds = async (locationIds: number[]): Promise<number[]> => {
    if (!locationIds.length) return [];
    const agentProfileLocations = await AgentProfileLocation.findAll({
      where: { location_id: { [Op.in]: locationIds } },
      attributes: ["agent_profile_id"],
    });
    return agentProfileLocations.map(
      (agentProfileLocation) => agentProfileLocation.agent_profile_id,
    );
  };
}

export default new AgentProfileLocationRepository();
