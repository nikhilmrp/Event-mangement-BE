import clientController from "@controllers/agentClient/client.controller";
import eventController from "@controllers/agentClient/event.controller";
import { validate } from "@middleware/validate.middleware";
import {
  createClientSchema,
  createEventSchema,
  updateClientSchema,
} from "@validators/agentClient.validator";
import { Router } from "express";

const router = Router();

router.get("/", clientController.getClients);
router.post("/", validate(createClientSchema), clientController.createClient);
router.patch("/:clientId", validate(updateClientSchema), clientController.updateClient);
router.post(
  "/:clientId/events",
  validate(createEventSchema),
  eventController.createEvent,
);

export default router;
