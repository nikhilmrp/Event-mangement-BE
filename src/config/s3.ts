import { S3Client } from "@aws-sdk/client-s3";

const { AWS_REGION = "ap-south-1", AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials:
    AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

export const s3Config = {
  bucket: process.env.AWS_S3_BUCKET || "",
  region: AWS_REGION,
  publicUrlBase: process.env.AWS_S3_PUBLIC_URL || "",
};

export const getPublicUrl = (key: string): string => {
  if (s3Config.publicUrlBase) {
    return `${s3Config.publicUrlBase.replace(/\/$/, "")}/${key}`;
  }

  return `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;
};
