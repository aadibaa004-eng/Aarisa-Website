import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Uploads a base64-encoded image string to Cloudinary.
 * @param file   Base64 data URI (e.g. "data:image/png;base64,...")
 * @param folder Cloudinary folder to place the upload in
 */
export async function uploadImage(
  file: string,
  folder = "arisa-nutrition"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/** Deletes an image from Cloudinary by its public ID. */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
