import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import ApiError from "../utils/ApiError";

export const validate = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body ?? {}, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return next(ApiError.badRequest(errorMessage));
    }

    req.body = value;
    next();
  };
};
