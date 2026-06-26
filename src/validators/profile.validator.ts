import Joi from "joi";
import { phoneValidator } from "./auth.validator";
import { PricingType } from "@models/profile/vendor/VendorPricing.model";

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

export const createVendorProfileSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    "any.required": "User id is required",
    "number.base": "User id is required",
    "number.positive": "User id must be a positive integer",
  }),
  business_name: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Business name is required",
    "string.empty": "Business name cannot be empty",
    "string.min": "Business name must be at least 1 character long",
    "string.max": "Business name cannot exceed 255 characters",
  }),
  description: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 1 character long",
    "string.max": "Description cannot exceed 255 characters",
  }),
  address: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Address is required",
    "string.empty": "Address cannot be empty",
    "string.min": "Address must be at least 1 character long",
    "string.max": "Address cannot exceed 255 characters",
  }),
  phone_number: phoneValidator.required(),
  email: Joi.string().email().trim().empty("").required().messages({
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
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

export const createBankDetailsSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    "any.required": "User id is required",
    "number.base": "User id is required",
    "number.positive": "User id must be a positive integer",
  }),
  account_holder_name: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Account holder name is required",
    "string.empty": "Account holder name cannot be empty",
    "string.min": "Account holder name must be at least 1 character long",
    "string.max": "Account holder name cannot exceed 255 characters",
  }),
  account_number: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Account number is required",
    "string.empty": "Account number cannot be empty",
    "string.min": "Account number must be at least 1 character long",
    "string.max": "Account number cannot exceed 255 characters",
  }),
  ifsc_code: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "IFSC code is required",
    "string.empty": "IFSC code cannot be empty",
    "string.min": "IFSC code must be at least 1 character long",
    "string.max": "IFSC code cannot exceed 255 characters",
  }),
  bank_name: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Bank name is required",
    "string.empty": "Bank name cannot be empty",
    "string.min": "Bank name must be at least 1 character long",
    "string.max": "Bank name cannot exceed 255 characters",
  }),
  branch_name: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Branch name is required",
    "string.empty": "Branch name cannot be empty",
    "string.min": "Branch name must be at least 1 character long",
    "string.max": "Branch name cannot exceed 255 characters",
  }),
  upi_id: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "UPI ID is required",
    "string.empty": "UPI ID cannot be empty",
    "string.min": "UPI ID must be at least 1 character long",
    "string.max": "UPI ID cannot exceed 255 characters",
  }),
  contact_number: Joi.string().trim().empty("").min(1).max(255).required().messages({
    "any.required": "Contact number is required",
    "string.empty": "Contact number cannot be empty",
    "string.min": "Contact number must be at least 1 character long",
    "string.max": "Contact number cannot exceed 255 characters",
  }),
});

export const createServiceDetailsSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    "any.required": "User id is required",
    "number.base": "User id is required",
    "number.positive": "User id must be a positive integer",
  }),
  vendor_type_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor type id is required",
    "number.base": "Vendor type id is required",
    "number.positive": "Vendor type id must be a positive integer",
  }),
  vendor_categoryids: Joi.array().items(Joi.number().integer().positive()).required().messages({
    "any.required": "Vendor category ids are required",
    "array.base": "Vendor category ids must be an array",
    "array.min": "Vendor category ids must be at least 1",
    "array.max": "Vendor category ids must be less than 10",
    "number.base": "Vendor category ids must be a positive integer",
    "number.positive": "Vendor category ids must be a positive integer",
  }),
}).options({ stripUnknown: true });

export const createPricingDetailsSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    "any.required": "User id is required",
    "number.base": "User id is required",
    "number.positive": "User id must be a positive integer",
  }),
  pricing_details: Joi.array()
    .items(
      Joi.object({
        pricing_type: Joi.string()
          .valid(...Object.values(PricingType))
          .required()
          .messages({
            "any.required": "Pricing type is required",
            "string.valid": "Pricing type must be a valid pricing type",
          }),
        amount: Joi.number().positive().required().messages({
          "any.required": "Amount is required",
          "number.base": "Amount is required",
          "number.positive": "Amount must be a positive number",
        }),
      }),
    )
    .required()
    .messages({
      "any.required": "Pricing details are required",
      "array.base": "Pricing details must be an array",
    }),
}).options({ stripUnknown: true });

export const uploadWorkGallerySchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    "any.required": "User id is required",
    "number.base": "User id is required",
    "number.positive": "User id must be a positive integer",
  }),
  image_urls: Joi.array().items(Joi.string().uri()).required().messages({
    "any.required": "Image urls are required",
    "array.base": "Image urls must be an array",
  }),
}).options({ stripUnknown: true });
