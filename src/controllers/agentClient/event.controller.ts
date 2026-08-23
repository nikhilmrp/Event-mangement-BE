import { ConfirmEventDto, CreateEventDto, UpdateEventDto } from "@dto/event.dto";
import { EventStatus } from "@models/agent/Event.model";
import eventService from "@services/event.service";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { Request, Response } from "express";

class EventController {
  getEventsByStatus = asyncHandler(async (req: Request, res: Response) => {
    const statusParam = req.query.status;
    let statuses: EventStatus[] = [];
    if (typeof statusParam === "string" && statusParam.trim() !== "") {
      const values = statusParam.split(",").map((s) => s.trim());
      const invalid = values.filter((v) => !Object.values(EventStatus).includes(v as EventStatus));
      if (invalid.length > 0) {
        throw ApiError.badRequest(`Invalid status value(s): ${invalid.join(", ")}`);
      }
      statuses = values as EventStatus[];
    }
    const events = await eventService.getEventsByStatus(req.user!, statuses);
    res.json(new ApiResponse(200, events, "Events fetched successfully"));
  });

  createEvent = asyncHandler(async (req: Request, res: Response) => {
    const clientId = Number(req.params.clientId);
    if (isNaN(clientId)) {
      throw ApiError.badRequest("Invalid client id");
    }
    const {
      event_name,
      event_priority,
      estimated_budget,
      preferred_date,
      additional_notes,
    }: CreateEventDto = req.body;
    const event = await eventService.createEvent(req.user!, {
      user_id: req.user!.id,
      client_id: clientId,
      event_name,
      event_priority,
      estimated_budget,
      preferred_date,
      additional_notes,
    });
    res.json(new ApiResponse(201, event, "Event created successfully"));
  });

  updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const eventId = Number(req.params.eventId);
    if (isNaN(eventId)) {
      throw ApiError.badRequest("Invalid event id");
    }
    const {
      event_name,
      event_priority,
      estimated_budget,
      preferred_date,
      additional_notes,
    }: UpdateEventDto = req.body;
    const event = await eventService.updateEvent(req.user!, {
      user_id: req.user!.id,
      event_id: eventId,
      event_name,
      event_priority,
      estimated_budget,
      preferred_date,
      additional_notes,
    });
    res.json(new ApiResponse(200, event, "Event updated successfully"));
  });

  getEventPreview = asyncHandler(async (req: Request, res: Response) => {
    const eventId = Number(req.params.eventId);
    if (isNaN(eventId)) {
      throw ApiError.badRequest("Invalid event id");
    }
    const preview = await eventService.getEventPreview(req.user!, eventId);
    res.json(new ApiResponse(200, preview, "Event preview fetched successfully"));
  });

  confirmEvent = asyncHandler(async (req: Request, res: Response) => {
    const eventId = Number(req.params.eventId);
    if (isNaN(eventId)) {
      throw ApiError.badRequest("Invalid event id");
    }
    const { payment_receipt_url }: ConfirmEventDto = req.body;
    const event = await eventService.confirmEvent(req.user!, {
      user_id: req.user!.id,
      event_id: eventId,
      payment_receipt_url,
    });
    res.json(new ApiResponse(200, event, "Event confirmed successfully"));
  });
}

export default new EventController();
