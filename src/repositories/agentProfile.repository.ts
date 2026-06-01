import { CreateAgentProfileDto } from "@dto/profile.dto";
import AgentProfile from "@models/profile/AgentProfile.model";
import { Transaction } from "sequelize";

class AgentProfileRepository {
  create = async (
    data: Pick<CreateAgentProfileDto, "user_id" | "address">,
    tx?: Transaction,
  ): Promise<AgentProfile> => {
    const { user_id, address } = data;
    return AgentProfile.create({ user_id, address, profile_step:2, profile_completed:false }, tx ? { transaction: tx } : undefined);
  };

  findByUserId = async (user_id: number): Promise<AgentProfile | null> => {
    return AgentProfile.findOne({ where: { user_id } });
  };
}

export default new AgentProfileRepository();