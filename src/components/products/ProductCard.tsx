import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // useEffect(() => (setAudio(new Audio(product.preview_url));), [product.preview_url]);

  return (
    <div className="cardShadow my-4 flex h-60 w-40 flex-col justify-between rounded-b-lg rounded-r-lg bg-zinc-900 p-4 hover:bg-zinc-800">
      <div
        className="relative h-28 w-32 justify-center"
        onMouseOver={() => setPreviewHover(true)}
        onMouseOut={() => setPreviewHover(false)}
      >
        {previewHover && (
          <div className="absolute z-50 flex h-full w-full items-center justify-center rounded-lg bg-zinc-600 bg-opacity-50 hover:cursor-pointer">
            <RiPlayMiniLine size={30} className="fill-zinc-300" />
          </div>
        )}
        <Image
          src="https://res.cloudinary.com/ddhal4lbv/image/upload/v1680578842/audiospace/RC-20-Retro-Color-UI-Alpha_ue0qpp.png"
          className="rounded-lg object-scale-down"
          alt="productimg"
          width={300}
          height={300}
          loading="lazy"
        />
      </div>

      <h5 className="scrollbar-hide overflow-x-scroll whitespace-nowrap py-2 hover:cursor-pointer">
        {product?.name}
      </h5>
      <p className="text-sm text-gray-300 hover:cursor-pointer hover:underline hover:underline-offset-2">
        {product?.seller.name}
      </p>
      <div className="scrollbar-hide flex gap-1 overflow-scroll whitespace-nowrap">
        {product?.subcategory.map((subcategory, i) => (
          <p
            className=" text-xs font-light tracking-tight text-gray-400 hover:cursor-pointer hover:underline hover:underline-offset-2"
            key={subcategory.id}
            onClick={() => handleRoute(product.category.name, subcategory.name)}
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
            <BsHeart className="cursor-pointer hover:fill-zinc-500" />
          </h5>
          <h5>
            <VscAdd className="cursor-pointer hover:fill-zinc-500" />
          </h5>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
