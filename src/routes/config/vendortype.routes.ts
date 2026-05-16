import vendorTypeController from "@controllers/config/vendortype.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validate.middleware";
import { createVendorTypeSchema } from "@validators/config/vendortype.validator";
import { Router } from "express";

const router = Router();

router.post(
  "/create-vendor-type",
  authenticate,
  validate(createVendorTypeSchema),
  vendorTypeController.createVendorType,
);

export default router;
