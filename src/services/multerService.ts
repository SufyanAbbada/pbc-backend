import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { AssetTypes } from "../common/enums";
import { Request, RequestHandler } from "express";
import { requestOrResponseBody } from "../common/types";
import { FILE_LIMITS } from "../common/constants";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "src/assets");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileSizeLimits: Record<AssetTypes, number> = {
  [AssetTypes.IMAGES]: FILE_LIMITS.MAX_IMAGE,
  [AssetTypes.DOCUMENTS]: FILE_LIMITS.MAX_DOCUMENT,
  [AssetTypes.VIDEOS]: FILE_LIMITS.MAX_VIDEO,
  [AssetTypes.AUDIOS]: FILE_LIMITS.MAX_AUDIO,
  [AssetTypes.MEDIA]: FILE_LIMITS.MAX_MEDIA,
};

const allowedFileTypes: Record<string, string[]> = {
  images: ["image/jpeg", "image/jpg", "image/png"],
  documents: ["application/pdf"],
  videos: [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
    "video/mkv",
  ],
  audios: ["audio/mpeg", "audio/wav", "audio/ogg"],
};

const fileFilter =
  (types: AssetTypes[]) =>
  (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = types.flatMap((type) => allowedFileTypes[type]);

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error(
        `Invalid file type ${file.fieldname}. Only ${allowedTypes.toString()} files are allowed for this input.`,
      );
      return cb(error as any, false);
    }
    cb(null, true);
  };

export const configureMulter = (
  fieldNames: string[],
  assetTypes: AssetTypes | AssetTypes[] = AssetTypes.IMAGES,
): RequestHandler => {
  const types = Array.isArray(assetTypes) ? assetTypes : [assetTypes];
  return (req, res, next) => {
    const upload = multer({
      storage,
      fileFilter: fileFilter(types),
      limits: {
        fileSize: Math.max(...types.map((type) => fileSizeLimits[type])),
      },
    }).fields(fieldNames.map((name) => ({ name, maxCount: 1 })));

    upload(req, res, (err) => {
      (
        req as Request & { originalRequestBody: requestOrResponseBody }
      ).originalRequestBody = {
        ...req.body,
        ...Object.fromEntries(
          fieldNames.map((fieldName) => [
            fieldName,
            Array.isArray(req.files) || !req.files || !(fieldName in req.files)
              ? null
              : (req.files[fieldName] as Express.Multer.File[])[0]?.path ||
                null,
          ]),
        ),
      };

      if (err instanceof multer.MulterError || err) {
        return res
          .status(400)
          .json({ error: [{ path: "file", msg: err.message }] });
      }

      next();
    });
  };
};
