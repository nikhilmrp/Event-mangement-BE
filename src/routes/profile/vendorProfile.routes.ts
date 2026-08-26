import vendorBookingController from "@controllers/profile/vendorBooking.controller";
import vendorProfileController from "@controllers/profile/vendorProfile.controller";
import vendorUnavailabilityController from "@controllers/profile/vendorUnavailability.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validate.middleware";
import { validateUserRole } from "@middleware/validateUserRole.middleware";
import { UserRole } from "@models/User.model";
import {
  addVendorUnavailabilitySchema,
  createPricingDetailsSchema,
  createServiceDetailsSchema,
  createVendorProfileSchema,
  uploadWorkGallerySchema,
} from "@validators/profile.validator";
import { Router } from "express";
import bankDetailsRoute from "./general/bankDetails.route";
const router = Router();

router.post(
  "/create-vendor-profile",
  authenticate,
  validate(createVendorProfileSchema),
  vendorProfileController.createVendorProfile,
);
router.post(
  "/create-service-details",
  authenticate,
  validate(createServiceDetailsSchema),
  vendorProfileController.createServiceDetails,
);
router.post(
  "/create-pricing-details",
  authenticate,
  validate(createPricingDetailsSchema),
  vendorProfileController.createPricingDetails,
);
router.post(
  "/upload-work-gallery",
  authenticate,
  validate(uploadWorkGallerySchema),
  vendorProfileController.uploadWorkGalleryImages,
);

router.post(
  "/add-unavailability",
  authenticate,
  validate(addVendorUnavailabilitySchema),
  vendorUnavailabilityController.addUnavailability,
);
router.get(
  "/get-unavailability-by-id/:userId",
  authenticate,
  vendorUnavailabilityController.getUnavailabilityByUserId,
);
router.get(
  "/get-my-bookings",
  authenticate,
  validateUserRole(UserRole.VENDOR),
  vendorBookingController.getMyBookings,
);
router.use("/bank-details", validateUserRole(UserRole.VENDOR), bankDetailsRoute);

export default router;
