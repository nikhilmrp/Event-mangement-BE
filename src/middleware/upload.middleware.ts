import ApiError from "@utils/ApiError";
import multer from "multer";
import { NextFunction, Request, Response } from "express";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(ApiError.badRequest(`Invalid file type: ${file.mimetype}. Allowed: jpeg, png, webp, gif`));
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
}).array("images", MAX_FILES);

export const uploadImages = (req: Request, res: Response, next: NextFunction) => {
  multerUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(ApiError.badRequest("Each image must be 5MB or smaller"));
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return next(ApiError.badRequest(`Maximum ${MAX_FILES} images allowed per request`));
      }
      return next(ApiError.badRequest(err.message));
    }

    if (err) {
      return next(err);
    }

    next();
  });
};
