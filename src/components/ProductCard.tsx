import Image from "next/image";
import React from "react";

function ProductCard() {
  return (
    <div className="w-fit rounded-md bg-gray-900 p-4">
      <Image
        src="https://res.cloudinary.com/ddhal4lbv/image/upload/v1680578842/audiospace/RC-20-Retro-Color-UI-Alpha_ue0qpp.png"
        className="flex items-center justify-center"
        alt="productimg"
        width={500}
        height={500}
      />

      <h5 className="overflow-x-clip whitespace-nowrap py-1">
        RC-20 Retro Color
      </h5>
      <p className="text-gray-400">XLN Audio</p>
      <p className="whitespace-nowrap text-xs font-light text-gray-400">
        Effects, Distortion
      </p>
      <div className="flex justify-between pt-2">
        <h5 className="text-gray-300">$30</h5>
        <div className="flex gap-2">
          <h5>❤️</h5>
          <h5>🛒</h5>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
