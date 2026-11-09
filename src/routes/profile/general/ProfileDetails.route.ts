import profileDetailsController from "@controllers/profile/profileDetails.controller";
import { validateUserRole } from "@middleware/validateUserRole.middleware";
import { UserRole } from "@models/User.model";
import { Router } from "express";

const router = Router();

router.get("/get-profile-details", profileDetailsController.getProfileDetails);
router.get(
  "/get-profile-details-by-id/:profileId",
  profileDetailsController.getProfileDetailsById,
);
router.patch(
  "/approve-user-profile/:userId",
  profileDetailsController.approveUserProfile,
);
router.patch(
  "/suspend-user/:userId",
  validateUserRole(UserRole.ADMIN),
  profileDetailsController.suspendUser,
);

export default router;
