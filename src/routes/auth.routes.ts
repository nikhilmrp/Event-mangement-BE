import { validate } from "@middleware/validate.middleware";
import authController from "../controllers/auth.controller";
import { Router } from "express";
import {
  loginSchema,
  registerAdminSchema,
  registerAgentSchema,
  registerVendorSchema,
} from "@validators/auth.validator";

const router = Router();

// admin user authentication
router.post("/register-admin", validate(registerAdminSchema), authController.registerAdmin);
router.post("/admin-login", validate(loginSchema), authController.adminLogin);
router.post("/admin-logout", authController.adminLogout);

// vendor user authentication
router.post("/register-vendor", validate(registerVendorSchema), authController.registerVendor);
router.post("/vendor-login", validate(loginSchema), authController.vendorLogin);
router.post("/vendor-logout", authController.vendorLogout);

// agent user authentication
router.post("/register-agent", validate(registerAgentSchema), authController.registerAgent);
router.post("/agent-login", validate(loginSchema), authController.agentLogin);
router.post("/agent-logout", authController.agentLogout);

export default router;
