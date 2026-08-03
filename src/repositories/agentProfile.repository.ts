import { CreateAgentProfileDto } from "@dto/profile.dto";
import AgentProfile from "@models/profile/agent/AgentProfile.model";
import { Transaction } from "sequelize";

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

  findAll = async (): Promise<AgentProfile[]> => {
    return AgentProfile.findAll({ where: { profile_completed: true } });
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
