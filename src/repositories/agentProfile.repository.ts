import { CreateAgentProfileDto } from "@dto/profile.dto";
import AgentProfile from "@models/profile/agent/AgentProfile.model";
import { Op, Transaction } from "sequelize";

class AgentProfileRepository {
  create = async (
    data: Pick<CreateAgentProfileDto, "user_id" | "address">,
    tx?: Transaction,
  ): Promise<AgentProfile> => {
    const { user_id, address } = data;
    return AgentProfile.create(
      { user_id, address, profile_step: 1, profile_completed: false },
      tx ? { transaction: tx } : undefined,
    );
  };

  findByUserId = async (user_id: number): Promise<AgentProfile | null> => {
    return AgentProfile.findOne({ where: { user_id } });
  };

  findById = async (id: number): Promise<AgentProfile | null> => {
    return AgentProfile.findByPk(id);
  };

  findAll = async (searchOptions?: {
    search: string;
    matchingUserIds: number[];
    matchingProfileIdsFromJoins: number[];
  }): Promise<AgentProfile[]> => {
    const where: { profile_completed: boolean; [Op.or]?: unknown[] } = { profile_completed: true };
    if (searchOptions) {
      const term = `%${searchOptions.search}%`;
      const orConditions: unknown[] = [{ address: { [Op.like]: term } }];
      if (searchOptions.matchingUserIds.length) {
        orConditions.push({ user_id: { [Op.in]: searchOptions.matchingUserIds } });
      }
      if (searchOptions.matchingProfileIdsFromJoins.length) {
        orConditions.push({ id: { [Op.in]: searchOptions.matchingProfileIdsFromJoins } });
      }
      where[Op.or] = orConditions;
    }
    return AgentProfile.findAll({ where });
  };

  updateProfileStep = async (
    user_id: number,
    profile_step: number,
    profile_completed: boolean,
    tx?: Transaction,
  ): Promise<void> => {
    await AgentProfile.update(
      { profile_step, profile_completed },
      { where: { user_id }, transaction: tx },
    );
  };
}

export default new AgentProfileRepository();
