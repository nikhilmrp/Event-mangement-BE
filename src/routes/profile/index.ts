import { Router } from "express";
import agentProfileRoutes from "./agentProfile.routes";
import vendorProfileRoutes from "./vendorProfile.routes";
import { authenticate } from "@middleware/auth.middleware";

const router = Router();

router.use("/agent", authenticate, agentProfileRoutes);
router.use("/vendor",authenticate, vendorProfileRoutes);

export default router;