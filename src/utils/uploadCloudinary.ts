import cloudinary from "./cloudinary";

export default async function uploadCloudinary(
  images: string[],
  folder: string
) {
  const options = {
    unique_filename: true,
    overwrite: true,
    folder: folder,
  };

  try {
    const uploadImages = await Promise.all(
      images.map((image) => cloudinary.uploader.upload(image, options))
    );
    return uploadImages.map((img) => ({ imageUrl: img.secure_url }));
  } catch (err) {
    console.error("Upload to Cloudinary failed", err);
    throw new Error("CLOUDINARY_UPLOAD_FAILED");
  }
}
