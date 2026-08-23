import { Router } from "express";
import authRoutes from "./auth.routes";
import configRoutes from "./config";
import profileRoutes from "./profile";
import uploadRoutes from "./upload.routes";
import agentClientRoutes from "./agentClient";
import { authenticate } from "@middleware/auth.middleware";
import { validateUserRole } from "@middleware/validateUserRole.middleware";
import { UserRole } from "@models/User.model";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Event-management API v1",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/config", configRoutes);
router.use("/profile", profileRoutes);
router.use("/upload", uploadRoutes);
router.use(
  "/agent-clients",
  authenticate,
  validateUserRole([UserRole.AGENT, UserRole.ADMIN]),
  agentClientRoutes,
);

export default router;
