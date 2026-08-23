import eventVendorController from "@controllers/agentClient/eventVendor.controller";
import { Router } from "express";

const router = Router();

router.get("/", eventVendorController.searchVendors);

export default router;
