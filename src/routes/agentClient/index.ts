import { Router } from "express";
import clientRoutes from "./client.routes";
import eventRoutes from "./event.routes";
import vendorSearchRoutes from "./vendorSearch.routes";

const router = Router();

router.use("/clients", clientRoutes);
router.use("/events", eventRoutes);
router.use("/vendors/search", vendorSearchRoutes);

export default router;
