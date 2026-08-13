import { Router } from "express";
import agentProfileRoutes from "./agentProfile.routes";
import vendorProfileRoutes from "./vendorProfile.routes";
import profileDetailsRoutes from "./general/ProfileDetails.route";
import { authenticate } from "@middleware/auth.middleware";
import { validateUserRole } from "@middleware/validateUserRole.middleware";
import { UserRole } from "@models/User.model";

const router = Router();

router.use("/agent", authenticate, agentProfileRoutes);
router.use("/vendor", authenticate, vendorProfileRoutes);
router.use("/general", authenticate, profileDetailsRoutes);

export default router;
