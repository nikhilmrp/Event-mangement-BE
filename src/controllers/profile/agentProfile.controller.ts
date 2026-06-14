import { CreateAgentProfileDto } from "@dto/profile.dto";
import AgentProfile from "@models/profile/agent/AgentProfile.model";
import profileService from "@services/agentProfile.service";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { Request, Response } from "express";

class AgentProfileController {
  createAgentProfile = asyncHandler(async (req: Request, res: Response) => {
    const { user_id, address,service_locations }: CreateAgentProfileDto = req.body;
    const agentProfile = await profileService.createAgentProfile({ user_id, address,service_locations });
    res.json(new ApiResponse(201, agentProfile, "Agent profile created successfully"));
  });
}

export default new AgentProfileController();