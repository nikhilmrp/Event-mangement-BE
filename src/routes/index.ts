import { Router } from "express";
import authRoutes from "./auth.routes";
import configRoutes from "./config";
import profileRoutes from "./profile";
import uploadRoutes from "./upload.routes";

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

export default router;
