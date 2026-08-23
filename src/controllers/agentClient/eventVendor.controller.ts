import { SaveEventVendorSelectionsDto } from "@dto/eventVendor.dto";
import eventVendorService from "@services/eventVendor.service";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { Request, Response } from "express";

class EventVendorController {
  searchVendors = asyncHandler(async (req: Request, res: Response) => {
    const location_id = Number(req.query.location_id);
    if (isNaN(location_id)) {
      throw ApiError.badRequest("location_id is required and must be a number");
    }

    const date = req.query.date;
    if (typeof date !== "string" || isNaN(Date.parse(date))) {
      throw ApiError.badRequest("date is required and must be a valid date");
    }

    let vendor_type_id: number | undefined;
    if (req.query.vendor_type_id !== undefined) {
      vendor_type_id = Number(req.query.vendor_type_id);
      if (isNaN(vendor_type_id)) {
        throw ApiError.badRequest("vendor_type_id must be a number");
      }
    }

    let vendor_category_id: number | undefined;
    if (req.query.vendor_category_id !== undefined) {
      vendor_category_id = Number(req.query.vendor_category_id);
      if (isNaN(vendor_category_id)) {
        throw ApiError.badRequest("vendor_category_id must be a number");
      }
    }

    const results = await eventVendorService.searchAvailableVendors({
      location_id,
      date,
      vendor_type_id,
      vendor_category_id,
    });
    res.json(new ApiResponse(200, results, "Vendors fetched successfully"));
  });

  saveVendorSelections = asyncHandler(async (req: Request, res: Response) => {
    const eventId = Number(req.params.eventId);
    if (isNaN(eventId)) {
      throw ApiError.badRequest("Invalid event id");
    }
    const { selections }: SaveEventVendorSelectionsDto = req.body;
    const result = await eventVendorService.saveEventVendorSelections(req.user!, {
      user_id: req.user!.id,
      event_id: eventId,
      selections,
    });
    res.json(new ApiResponse(200, result, "Vendor selections saved successfully"));
  });
}

export default new EventVendorController();
