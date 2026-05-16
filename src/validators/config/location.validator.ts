import Joi from "joi";

export const createLocationSchema = Joi.object({
  name: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
    "string.min": "Name is required",
  }),
  status: Joi.boolean().required().messages({
    "any.required": "Status is required",
    "boolean.base": "Status must be a boolean",
  }),
}).options({ stripUnknown: true });
