import bankDetailsController from "@controllers/profile/bankDetails.controller";
import { validate } from "@middleware/validate.middleware";
import { createBankDetailsSchema } from "@validators/profile.validator";
import { Router } from "express";

const router = Router();

router.post(
  "/create-bank-details",
  validate(createBankDetailsSchema),
  bankDetailsController.createBankDetails,
);

export default router;
