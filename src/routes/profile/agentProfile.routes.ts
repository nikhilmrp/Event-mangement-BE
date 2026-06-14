import agentProfileController from "@controllers/profile/agentProfile.controller";
import { validate } from "@middleware/validate.middleware";
import { createAgentProfileSchema } from "@validators/profile.validator";
import bankDetailsRoute from "./general/bankDetails.route";
import { Router } from "express";
import { UserRole } from "@models/User.model";
import { validateUserRole } from "@middleware/validateUserRole.middleware";

const router = Router();

router.post("/create-agent-profile", validate(createAgentProfileSchema), agentProfileController.createAgentProfile);
router.use("/bank-details", validateUserRole(UserRole.AGENT), bankDetailsRoute);

export default router;