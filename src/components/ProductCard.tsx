import Image from "next/image";
import React, { useState } from "react";
import { BsHeart, BsHeartHalf, BsHeartFill } from "react-icons/bs";
import { VscAdd } from "react-icons/vsc";
import { type ProductSchema } from "~/types/schema";

interface ProductCardProps {
  product: ProductSchema;
}

function ProductCard({ product }: ProductCardProps) {
  const [heartHover, setHeartHover] = useState(false);

  console.log(product);
  return (
    <div className="w-fit rounded-md bg-zinc-900 p-4">
      <div className="relative h-32 w-full justify-center">
        <Image
          src="https://res.cloudinary.com/ddhal4lbv/image/upload/v1680578842/audiospace/RC-20-Retro-Color-UI-Alpha_ue0qpp.png"
          className="w-full rounded-lg object-scale-down"
          alt="productimg"
          width={300}
          height={300}
          loading="lazy"
        />
      </div>

      <h5 className="overflow-x-clip whitespace-nowrap py-1">
        {product?.name}
      </h5>
      <p className="text-gray-300">{product?.seller.name}</p>
      {product?.Subcategory.map((subcategory) => (
        <p
          className="whitespace-nowrap text-xs font-light text-gray-400"
          key={subcategory.id}
        >
          {subcategory.name}
        </p>
      ))}

      <div className="flex justify-between pt-2">
        <h5 className="text-gray-200">${product?.price}</h5>
        <div className="flex items-center gap-4">
          <h5
            onMouseOver={() => void setHeartHover(true)}
            onMouseLeave={() => void setHeartHover(false)}
          >
            {heartHover ? <BsHeartHalf /> : <BsHeart />}
          </h5>
          <h5>
            <VscAdd />
          </h5>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
