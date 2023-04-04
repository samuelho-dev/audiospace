import Image from "next/image";
import React from "react";
import { GoPlay } from "react-icons/go";

function BeatDisplay() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col">
        <div className="flex w-full gap-4 rounded-t-lg bg-rose-400 py-1">
          <div className="flex w-1/5 items-center justify-center">
            <GoPlay size={40} />
          </div>
          <div className="flex flex-col">
            <h5 className="whitespace-nowrap">Beat Battle Title</h5>
            <p className="whitespace-nowrap text-sm">Winner - Artist Name</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 py-2">
        <Image
          src="https://res.cloudinary.com/ddhal4lbv/image/upload/v1680578842/audiospace/RC-20-Retro-Color-UI-Alpha_ue0qpp.png"
          className="flex items-center justify-center"
          alt="productimg"
          width={60}
          height={60}
        />
        <p className="text-sm font-light">Prize: Product by Company</p>
      </div>
    </div>
  );
}

export default BeatDisplay;
