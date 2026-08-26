import { EventStatus } from "@models/agent/Event.model";
import eventVendorService from "@services/eventVendor.service";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { Request, Response } from "express";

class VendorBookingController {
  getMyBookings = asyncHandler(async (req: Request, res: Response) => {
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
    const bookings = await eventVendorService.getVendorBookings(req.user!, statuses);
    res.json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
  });
}

export default new VendorBookingController();
