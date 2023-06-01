import Image from "next/image";
import React, { useState } from "react";
import { BiWindowClose } from "react-icons/Bi";

interface InputImagesProps {
  multiple: boolean;
  setErrorState: (error: string) => void;
}

function InputImages({ multiple, setErrorState }: InputImagesProps) {
  const [previewImages, setPreviewImages] = useState<File[] | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    if (files) {
      const newArr = Array.from(files);
      console.log(newArr.length);
      if (newArr.length > 5) {
        setErrorState(
          `You may only upload ${multiple ? "5" : "1"} image${
            multiple ? "s" : ""
          }`
        );
      } else {
        setPreviewImages(newArr);
      }
    }
  };

  const removeImage = (index: number) => {
    if (previewImages) {
      const copy = previewImages.filter((_, i) => i !== index);

      if (copy.length === 0) {
        setPreviewImages(null);
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
          onChange={handleInput}
        />
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
