import profileDetailsController from "@controllers/profile/profileDetails.controller";
import { Router } from "express";

const router = Router();

router.get("/get-profile-details", profileDetailsController.getProfileDetails);
router.get(
  "/get-profile-details-by-id/:profileId",
  profileDetailsController.getProfileDetailsById,
);

export default router;
