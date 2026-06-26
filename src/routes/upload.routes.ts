import uploadController from "@controllers/upload.controller";
import { authenticate } from "@middleware/auth.middleware";
import { uploadImages } from "@middleware/upload.middleware";
import { Router } from "express";

const router = Router();

router.post("/images", authenticate, uploadImages, uploadController.uploadImages);

export default router;
