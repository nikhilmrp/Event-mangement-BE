import agentProfileController from "@controllers/profile/agentProfile.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validate.middleware";
import { createAgentProfileSchema } from "@validators/profile.validator";
import { Router } from "express";

const router = Router();

router.post("/create-agent-profile", authenticate, validate(createAgentProfileSchema), agentProfileController.createAgentProfile);

export default router;