import { validate } from "@middleware/validate.middleware";
import authController from "../controllers/auth.controller";
import { Router } from "express";
import { loginSchema, registerAdminSchema } from "@validators/auth.validator";

const router = Router();

router.post("/register-admin", validate(registerAdminSchema), authController.registerAdmin);
router.post("/admin-login", validate(loginSchema), authController.adminLogin);
router.post("/admin-logout", authController.adminLogout);
// router.post("/register-agent", validate(registerAgentSchema), authController.registerAgent);

export default router;
