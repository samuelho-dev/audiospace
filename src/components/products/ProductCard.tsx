import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsHeart, BsHeartHalf, BsHeartFill } from "react-icons/bs";
import { VscAdd } from "react-icons/vsc";
import { type ProductSchema } from "~/types/schema";
import { RiPlayMiniLine } from "react-icons/ri";
import { UseRouterFilter } from "~/utils/useRouterFilter";

interface ProductCardProps {
  product: ProductSchema;
}

function ProductCard({ product }: ProductCardProps) {
  const { asPath, query } = useRouter();
  const [previewHover, setPreviewHover] = useState(false);
  const { handleRoute } = UseRouterFilter();

  return (
    <div className="cardShadow w-40 rounded-b-lg rounded-r-lg bg-zinc-900 p-4 hover:bg-zinc-800">
      <div
        className="relative h-fit w-full justify-center"
        onMouseOver={() => setPreviewHover(true)}
        onMouseOut={() => setPreviewHover(false)}
      >
        {previewHover && (
          <div className="absolute z-50 flex h-full w-full items-center justify-center rounded-lg bg-red-600 bg-opacity-70 hover:cursor-pointer">
            <RiPlayMiniLine size={30} className="fill-zinc-300" />
          </div>
        )}
        <Image
          src="https://res.cloudinary.com/ddhal4lbv/image/upload/v1680578842/audiospace/RC-20-Retro-Color-UI-Alpha_ue0qpp.png"
          className="w-full rounded-lg object-scale-down"
          alt="productimg"
          width={300}
          height={300}
          loading="lazy"
        />
      </div>

      <h5 className="overflow-x-clip whitespace-nowrap py-2">
        {product?.name}
      </h5>
      <p className="text-gray-300">{product?.seller.name}</p>
      <div className="flex flex-wrap gap-1">
        {product?.subcategory.map((subcategory, i) => (
          <p
            className="whitespace-nowrap text-xs font-light text-gray-400 hover:cursor-pointer hover:underline hover:underline-offset-2"
            key={subcategory.id}
            onClick={() => handleRoute(subcategory.name)}
          >
            {subcategory.name}
            {i !== product.subcategory.length - 1 && ","}
          </p>
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <h5 className="text-gray-200">${product?.price}</h5>
        <div className="flex items-center gap-4">
          <h5>
            <BsHeart className="hover:fill-zinc-500" />
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
