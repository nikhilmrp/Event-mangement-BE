import uploadService from "@services/upload.service";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { Request, Response } from "express";

class UploadController {
  uploadImages = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const folder = typeof req.body.folder === "string" ? req.body.folder : "Development_s3";

    const urls = await uploadService.uploadImages(files, folder);

    res.json(new ApiResponse(200, { urls }, "Images uploaded successfully"));
  });
}

export default new UploadController();
