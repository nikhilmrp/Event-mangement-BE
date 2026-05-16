import Joi from "joi";

export const createVendorCategorySchema = Joi.object({
  vendor_type_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor type id is required",
    "number.base": "Vendor type id is required",
    "number.positive": "Vendor type id must be a positive integer",
  }),
  name: Joi.string().trim().empty("").min(2).max(150).required().messages({
    "any.required": "Category name is required",
    "string.empty": "Category name cannot be empty",
    "string.min": "Category name must be at least 2 characters long",
    "string.max": "Category name cannot exceed 150 characters",
  }),
  status: Joi.boolean().required().messages({
    "any.required": "Status is required",
    "boolean.base": "Status must be a boolean",
  }),
}).options({ stripUnknown: true });
