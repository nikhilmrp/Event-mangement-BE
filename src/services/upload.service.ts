import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getPublicUrl, s3Client, s3Config } from "@config/s3";
import ApiError from "@utils/ApiError";
import { randomUUID } from "crypto";
import path from "path";

class UploadService {
  async uploadImages(files: Express.Multer.File[], folder = "uploads"): Promise<string[]> {
    if (!s3Config.bucket) {
      throw ApiError.internal("AWS_S3_BUCKET is not configured");
    }

    if (!files.length) {
      throw ApiError.badRequest("At least one image is required");
    }

    const uploadPromises = files.map(async (file) => {
      const extension = path.extname(file.originalname) || this.getExtensionFromMime(file.mimetype);
      const key = `${folder}/${randomUUID()}${extension}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: s3Config.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return getPublicUrl(key);
    });

    return Promise.all(uploadPromises);
  }

  private getExtensionFromMime(mimetype: string): string {
    const map: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
    };

    return map[mimetype] || ".jpg";
  }
}

export default new UploadService();
