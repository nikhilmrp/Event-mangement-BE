import eventController from "@controllers/agentClient/event.controller";
import eventVendorController from "@controllers/agentClient/eventVendor.controller";
import { validate } from "@middleware/validate.middleware";
import {
  confirmEventSchema,
  saveEventVendorSelectionsSchema,
  updateEventSchema,
} from "@validators/agentClient.validator";
import { Router } from "express";

const router = Router();

router.get("/", eventController.getEventsByStatus);
router.patch("/:eventId", validate(updateEventSchema), eventController.updateEvent);
router.get("/:eventId/preview", eventController.getEventPreview);
router.put(
  "/:eventId/vendors",
  validate(saveEventVendorSelectionsSchema),
  eventVendorController.saveVendorSelections,
);
router.patch(
  "/:eventId/confirm",
  validate(confirmEventSchema),
  eventController.confirmEvent,
);

export default router;
