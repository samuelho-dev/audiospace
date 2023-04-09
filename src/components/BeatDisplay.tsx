import Image from "next/image";
import React from "react";
import { GoPlay } from "react-icons/go";

function BeatDisplay() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col">
        <div className="flex w-full gap-4 rounded-t-lg bg-emerald-700">
          <div className="flex w-3/12 items-center justify-center">
            <GoPlay size={30} />
          </div>
          <div className="flex w-9/12 flex-col justify-center">
            <h5 className="whitespace-nowrap">Beat Battle Title</h5>
            <p className="whitespace-nowrap text-xs">Winner - Artist Name</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 p-2">
        <div className="relative">
          <Image
            src="https://res.cloudinary.com/ddhal4lbv/image/upload/v1680578842/audiospace/RC-20-Retro-Color-UI-Alpha_ue0qpp.png"
            className="rounded-md object-scale-down"
            alt="productimg"
            width={50}
            height={50}
            loading="lazy"
          />
        </div>
        <p className="whitespace-nowrap text-xs font-light">
          Prize: Product by Company
        </p>
      </div>
    </div>
  );
}

export default BeatDisplay;
