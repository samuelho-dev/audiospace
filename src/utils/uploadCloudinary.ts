import cloudinary from "~/server/cloudinary/cloudinary";

export default async function uploadCloudinary(
  images: FileList,
  folder: string
) {
  const options = {
    unique_filename: true,
    overwrite: true,
    folder: folder,
  };
  try {
    const filesArray = Array.from(images);
    const uploadImages = await Promise.all(
      filesArray.map(async (file: File) => {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        return cloudinary.uploader.upload(dataUrl, options);
      })
    );

    return uploadImages.map((img) => img.secure_url);
  } catch (err) {
    console.error("Upload to Cloudinary failed", err);
    throw new Error("CLOUDINARY_UPLOAD_FAILED");
  }
}
