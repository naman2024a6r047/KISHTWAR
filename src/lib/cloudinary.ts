import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// ─────────────────────────────────────────────
// Upload Helpers
// ─────────────────────────────────────────────

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = "kishtwar",
  options?: {
    transformation?: object[];
    maxWidth?: number;
    quality?: string;
  }
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder: `kishtwar/${folder}`,
      resource_type: "image",
      quality: options?.quality || "auto:good",
      fetch_format: "auto",
    };

    if (options?.maxWidth) {
      uploadOptions.transformation = [
        { width: options.maxWidth, crop: "limit" },
      ];
    }

    if (options?.transformation) {
      uploadOptions.transformation = options.transformation;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function uploadImageFromUrl(
  imageUrl: string,
  folder: string = "kishtwar"
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: `kishtwar/${folder}`,
    resource_type: "image",
    quality: "auto:good",
    fetch_format: "auto",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch {
    return false;
  }
}

export function getImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }
): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width: options?.width,
        height: options?.height,
        crop: options?.crop || "fill",
        quality: options?.quality || "auto:good",
        fetch_format: "auto",
      },
    ],
  });
}

export function getThumbnailUrl(publicId: string, size: number = 300): string {
  return getImageUrl(publicId, {
    width: size,
    height: size,
    crop: "fill",
  });
}
