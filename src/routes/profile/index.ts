import { Router } from "express";
import agentProfileRoutes from "./agentProfile.routes";

const router = Router();

router.use("/agent", agentProfileRoutes);

export default router;