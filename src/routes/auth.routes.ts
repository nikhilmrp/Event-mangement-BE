import { validate } from "@middleware/validate.middleware";
import authController from "../controllers/auth.controller";
import { Router } from "express";
import { registerAdminSchema } from "@validators/auth.validator";

const router = Router();

router.post("/register-admin", validate(registerAdminSchema), authController.registerAdmin);

export default router;
