import locationController from "@controllers/config/location.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validate.middleware";
import { createLocationSchema } from "@validators/config/location.validator";
import { Router } from "express";

const router = Router();

router.post(
  "/create-location",
  authenticate,
  validate(createLocationSchema),
  locationController.createLocation,
);

router.get("/get-locations", authenticate, locationController.getLocations);

export default router;
