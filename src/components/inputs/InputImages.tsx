import Image from "next/image";
import React, { useState } from "react";
import { BiWindowClose } from "react-icons/bi";
import { readFileasBase64 } from "~/utils/readFileAsBase64";

interface InputImagesProps {
  multiple: boolean;
  setErrorState: (error: string) => void;
  setImages: (image: string[] | null) => void;
}

function InputImages({ multiple, setErrorState, setImages }: InputImagesProps) {
  const [previewImages, setPreviewImages] = useState<File[] | null>(null);

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    if (files) {
      const filesArray = Array.from(files);

      if (filesArray.length > 5) {
        setErrorState(
          `You may only upload ${multiple ? "5" : "1"} image${
            multiple ? "s" : ""
          }`
        );
      } else {
        const filesBase64 = await Promise.all(
          filesArray.map((file) => readFileasBase64(file))
        );

        setImages(filesBase64);
        setPreviewImages(filesArray);
      }
    }
  };

  const removeImage = (index: number) => {
    if (previewImages) {
      const copy = previewImages.filter((_, i) => i !== index);

      if (copy.length === 0) {
        setPreviewImages(null);
        setImages(null);
      } else {
        setPreviewImages(copy);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-zinc-800">
      <label
        htmlFor="files"
        className=" rounded-sm  p-2 text-white hover:cursor-pointer hover:bg-emerald-600"
      >
        {previewImages && previewImages.length >= 5 ? (
          <h4 className="rounded-sm p-2 font-semibold tracking-tighter">
            Files pending upload...
          </h4>
        ) : (
          <>
            <div className="flex flex-col">
              <h5>{`Click here to select your image${multiple ? "s" : ""}`}</h5>
              <p className="text-sm font-thin tracking-tighter">
                PNG, JPEG, or JPG (MAX. 800 x 400px)
              </p>
            </div>
            <input
              id="files"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              multiple={true}
              className="hidden"
              onChange={(e) => void handleInput(e)}
            />
          </>
        )}
      </label>

      {previewImages && (
        <div className="grid grid-cols-5 justify-between gap-4 p-2">
          {previewImages.map((image, i) => (
            <div
              key={i}
              className="flex h-32 w-32 items-center justify-center rounded-sm border border-zinc-800 hover:opacity-80"
            >
              <BiWindowClose
                size={25}
                onClick={() => removeImage(i)}
                className="absolute -translate-x-10 -translate-y-10 opacity-80 hover:cursor-pointer"
              />

              <Image
                src={URL.createObjectURL(image)}
                width={100}
                height={100}
                alt={"test images"}
                className="p-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InputImages;
