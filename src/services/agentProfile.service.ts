import { AgentProfileResponseDto, CreateAgentProfileDto } from "@dto/profile.dto";
import agentProfileRepository from "@repositories/agentProfile.repository";
import agentProfileLocationRepository from "@repositories/agentProfileLocation.repository";
import sequelize from "@config/database";
import ApiError from "@utils/ApiError";
import locationRepository from "@repositories/config/location.repository";

class AgentProfileService {
  createAgentProfile = async (data: CreateAgentProfileDto): Promise<AgentProfileResponseDto> => {
    const { user_id, address, service_locations } = data;
    const existingAgentProfile = await agentProfileRepository.findByUserId(user_id);
    if (existingAgentProfile) {
      throw ApiError.conflict("Agent profile already exists for this user");
    }
    const locations = await locationRepository.findByIds(service_locations);

    if (locations.length !== service_locations.length) {
      throw ApiError.notFound("Some of the service locations are not found");
    }
    
    return sequelize.transaction(async (tx) => {
      const agentProfile = await agentProfileRepository.create({ user_id, address }, tx);
      const agentProfileLocations = await agentProfileLocationRepository.bulkCreateForAgentProfile(
        agentProfile.id,
        service_locations,
        tx,
      );

      return {
        id: agentProfile.id,
        user_id: agentProfile.user_id,
        address: agentProfile.address,
        service_locations: agentProfileLocations.map((l) => l.location_id),
      };
    });
  };

  // Best-practice helper for "update junction table" semantics (replace set)
  setServiceLocations = async (
    agentProfileId: number,
    service_locations: number[],
  ): Promise<{ agent_profile_id: number; service_locations: number[] }> => {
    return sequelize.transaction(async (tx) => {
      await agentProfileLocationRepository.deleteByAgentProfileId(agentProfileId, tx);
      const created = await agentProfileLocationRepository.bulkCreateForAgentProfile(
        agentProfileId,
        service_locations,
        tx,
      );

      return { agent_profile_id: agentProfileId, service_locations: created.map((l) => l.location_id) };
    });
  };
}

export default new AgentProfileService();