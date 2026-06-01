import Joi from "joi";

export const createAgentProfileSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    "any.required": "User id is required",
    "number.base": "User id is required",
    "number.positive": "User id must be a positive integer",
  }),
  address: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Address is required",
    "string.empty": "Address cannot be empty",
    "string.min": "Address must be at least 1 character long",
    "string.max": "Address cannot exceed 255 characters",
  }),
  service_locations: Joi.array().items(Joi.number().integer().positive()).required().messages({
    "any.required": "Service locations are required",
    "array.base": "Service locations must be an array",
    "array.min": "Service locations must be at least 1",
    "array.max": "Service locations must be less than 10",
    "number.base": "Service locations must be a positive integer",
    "number.positive": "Service locations must be a positive integer",
  }),
}).options({ stripUnknown: true });