import Joi from "joi";

// Custom validator for strong password
const passwordValidator = Joi.string()
  .min(8)
  .max(128)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"))
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 128 characters",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    "any.required": "Password is required",
  });

// Custom validator for name fields
const nameValidator = (fieldName: string) =>
  Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .trim()
    .messages({
      "string.min": `${fieldName} must be at least 2 characters long`,
      "string.max": `${fieldName} cannot exceed 100 characters`,
      "string.pattern.base": `${fieldName} can only contain letters and spaces`,
      "any.required": `${fieldName} is required`,
      "string.empty": `${fieldName} cannot be empty`,
    });

// Custom validator for Indian phone numbers
const phoneValidator = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .messages({
    "string.pattern.base": "Please provide a valid 10-digit Indian phone number starting with 6-9",
    "any.required": "Phone number is required",
    "string.empty": "Phone number cannot be empty",
  });

// Register Admin Schema
export const registerAdminSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
  password: passwordValidator.required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your password",
    })
    .optional(),
  first_name: nameValidator("First name").required(),
  last_name: nameValidator("Last name").required(),
  phone: phoneValidator.required(),
}).options({ stripUnknown: true });

// Login Schema
export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
}).options({ stripUnknown: true });

// Update Profile Schema
export const updateProfileSchema = Joi.object({
  first_name: nameValidator("First name").optional(),
  last_name: nameValidator("Last name").optional(),
  phone: phoneValidator.optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update",
  })
  .options({ stripUnknown: true });

// Change Password Schema
export const changePasswordSchema = Joi.object({
  old_password: Joi.string().required().messages({
    "any.required": "Current password is required",
    "string.empty": "Current password cannot be empty",
  }),
  new_password: passwordValidator.required().invalid(Joi.ref("old_password")).messages({
    "any.invalid": "New password must be different from current password",
  }),
  confirm_password: Joi.string().valid(Joi.ref("new_password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your new password",
  }),
}).options({ stripUnknown: true });

// Email Validation Schema
export const emailSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
}).options({ stripUnknown: true });

// Reset Password Schema
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Reset token is required",
    "string.empty": "Reset token cannot be empty",
  }),
  new_password: passwordValidator.required(),
  confirm_password: Joi.string().valid(Joi.ref("new_password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your new password",
  }),
}).options({ stripUnknown: true });

// Update User Status Schema (for admin operations)
export const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid("active", "inactive", "suspended").required().messages({
    "any.only": "Status must be one of: active, inactive, suspended",
    "any.required": "Status is required",
  }),
}).options({ stripUnknown: true });
