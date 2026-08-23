import Joi from "joi";
import { phoneValidator } from "./auth.validator";
import { EventPriority } from "@models/agent/Event.model";
import { PricingType } from "@models/profile/vendor/VendorPricing.model";

export const createClientSchema = Joi.object({
  agent_id: Joi.number().integer().positive().optional().messages({
    "number.base": "agent_id must be a positive integer",
    "number.positive": "agent_id must be a positive integer",
  }),
  name: Joi.string().trim().empty("").min(1).max(150).required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name cannot exceed 150 characters",
  }),
  email: Joi.string().email().trim().optional().messages({
    "string.email": "Email must be a valid email address",
  }),
  phone: phoneValidator.required(),
  address: Joi.string().trim().empty("").min(1).max(500).required().messages({
    "any.required": "Address is required",
    "string.empty": "Address cannot be empty",
    "string.min": "Address must be at least 1 character long",
    "string.max": "Address cannot exceed 500 characters",
  }),
  location_id: Joi.number().integer().positive().required().messages({
    "any.required": "Location id is required",
    "number.base": "Location id must be a positive integer",
    "number.positive": "Location id must be a positive integer",
  }),
}).options({ stripUnknown: true });

export const updateClientSchema = Joi.object({
  name: Joi.string().trim().empty("").min(1).max(150).optional().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name cannot exceed 150 characters",
  }),
  email: Joi.string().email().trim().optional().messages({
    "string.email": "Email must be a valid email address",
  }),
  phone: phoneValidator.optional(),
  address: Joi.string().trim().empty("").min(1).max(500).optional().messages({
    "string.empty": "Address cannot be empty",
    "string.min": "Address must be at least 1 character long",
    "string.max": "Address cannot exceed 500 characters",
  }),
  location_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Location id must be a positive integer",
    "number.positive": "Location id must be a positive integer",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update",
  })
  .options({ stripUnknown: true });

export const createEventSchema = Joi.object({
  event_name: Joi.string().trim().empty("").min(1).max(150).required().messages({
    "any.required": "Event name is required",
    "string.empty": "Event name cannot be empty",
    "string.min": "Event name must be at least 1 character long",
    "string.max": "Event name cannot exceed 150 characters",
  }),
  event_priority: Joi.string()
    .valid(...Object.values(EventPriority))
    .required()
    .messages({
      "any.required": "Event priority is required",
      "any.only": "Event priority must be one of low, moderate, high",
    }),
  estimated_budget: Joi.number().positive().required().messages({
    "any.required": "Estimated budget is required",
    "number.base": "Estimated budget must be a positive number",
    "number.positive": "Estimated budget must be a positive number",
  }),
  preferred_date: Joi.date().iso().required().messages({
    "any.required": "Preferred date is required",
    "date.base": "Preferred date must be a valid date",
    "date.format": "Preferred date must be in YYYY-MM-DD format",
  }),
  additional_notes: Joi.string().trim().allow("").max(2000).optional().messages({
    "string.max": "Additional notes cannot exceed 2000 characters",
  }),
}).options({ stripUnknown: true });

export const updateEventSchema = Joi.object({
  event_name: Joi.string().trim().empty("").min(1).max(150).optional().messages({
    "string.empty": "Event name cannot be empty",
    "string.min": "Event name must be at least 1 character long",
    "string.max": "Event name cannot exceed 150 characters",
  }),
  event_priority: Joi.string()
    .valid(...Object.values(EventPriority))
    .optional()
    .messages({
      "any.only": "Event priority must be one of low, moderate, high",
    }),
  estimated_budget: Joi.number().positive().optional().messages({
    "number.base": "Estimated budget must be a positive number",
    "number.positive": "Estimated budget must be a positive number",
  }),
  preferred_date: Joi.date().iso().optional().messages({
    "date.base": "Preferred date must be a valid date",
    "date.format": "Preferred date must be in YYYY-MM-DD format",
  }),
  additional_notes: Joi.string().trim().allow("").max(2000).optional().messages({
    "string.max": "Additional notes cannot exceed 2000 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update",
  })
  .options({ stripUnknown: true });

export const saveEventVendorSelectionsSchema = Joi.object({
  selections: Joi.array()
    .items(
      Joi.object({
        vendor_profile_id: Joi.number().integer().positive().required().messages({
          "any.required": "vendor_profile_id is required",
          "number.base": "vendor_profile_id must be a positive integer",
          "number.positive": "vendor_profile_id must be a positive integer",
        }),
        pricing_type: Joi.string()
          .valid(...Object.values(PricingType))
          .required()
          .messages({
            "any.required": "pricing_type is required",
            "any.only": "pricing_type must be one of per_hour, per_day, per_event",
          }),
      }),
    )
    .min(0)
    .required()
    .messages({
      "any.required": "selections is required",
      "array.base": "selections must be an array",
    }),
}).options({ stripUnknown: true });

export const confirmEventSchema = Joi.object({
  payment_receipt_url: Joi.string().uri().required().messages({
    "any.required": "payment_receipt_url is required",
    "string.uri": "payment_receipt_url must be a valid URL",
  }),
}).options({ stripUnknown: true });
