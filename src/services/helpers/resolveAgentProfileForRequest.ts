import { UserRole } from "@models/User.model";
import agentProfileRepository from "@repositories/agentProfile.repository";
import ApiError from "@utils/ApiError";
import { JWTPayload } from "@utils/helpers";

export interface AgentScope {
  // Requesting agent's own AgentProfile id, or null when the caller is an
  // admin acting with unrestricted cross-agent access.
  agentProfileId: number | null;
}

export const resolveAgentScope = async (user: JWTPayload): Promise<AgentScope> => {
  if (user.role === UserRole.ADMIN) {
    return { agentProfileId: null };
  }
  const agentProfile = await agentProfileRepository.findByUserId(user.id);
  if (!agentProfile) {
    throw ApiError.notFound("Agent profile not found");
  }
  return { agentProfileId: agentProfile.id };
};

export const resolveAgentProfileIdForCreate = async (
  user: JWTPayload,
  agent_id?: number,
): Promise<number> => {
  if (user.role === UserRole.ADMIN) {
    if (!agent_id) {
      throw ApiError.badRequest("agent_id is required when creating as admin");
    }
    const agentProfile = await agentProfileRepository.findByUserId(agent_id);
    if (!agentProfile) {
      throw ApiError.notFound("Agent not found for the given agent_id");
    }
    return agentProfile.id;
  }
  const agentProfile = await agentProfileRepository.findByUserId(user.id);
  if (!agentProfile) {
    throw ApiError.notFound("Agent profile not found");
  }
  return agentProfile.id;
};

export const assertAgentOwnership = (
  scope: AgentScope,
  resourceAgentProfileId: number,
): void => {
  if (scope.agentProfileId === null) return;
  if (scope.agentProfileId !== resourceAgentProfileId) {
    throw ApiError.notFound("Resource not found");
  }
};
