import Joi from "joi";

export const createVendorTypeSchema = Joi.object({
  name: Joi.string().trim().empty("").min(2).max(150).required().messages({
    "any.required": "Vendor type name is required",
    "string.empty": "Vendor type name cannot be empty",
    "string.min": "Vendor type name must be at least 2 characters long",
    "string.max": "Vendor type name cannot exceed 150 characters",
  }),
  commission_percentage: Joi.number().min(0).max(100).precision(2).required().messages({
    "any.required": "Commission percentage is required",
    "number.base": "Commission percentage is required",
    "number.min": "Commission percentage must be at least 0",
    "number.max": "Commission percentage cannot exceed 100",
  }),
  status: Joi.boolean().required().messages({
    "any.required": "Status is required",
    "boolean.base": "Status must be a boolean",
  }),
}).options({ stripUnknown: true });
