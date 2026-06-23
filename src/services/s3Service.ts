import s3Client from "../config/s3Client";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AssetTypes } from "../common/enums";

class S3Service {
  async uploadAsset(
    filePath: string,
    folder: string = AssetTypes.IMAGES,
  ): Promise<string> {
    const sanitizedFileName = path
      .basename(filePath)
      .replace(/[^a-zA-Z0-9.-]/g, "-")
      .replace(/\s+/g, "-")
      .toLowerCase();

    const fileName = `${folder}/${Math.floor(Math.random() * 10000)}-${sanitizedFileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: fs.readFileSync(filePath),
        ContentType:
          mime.lookup(path.extname(filePath)) || "application/octet-stream",
      }),
    );

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${fileName}`;
  }
}

export default new S3Service();
