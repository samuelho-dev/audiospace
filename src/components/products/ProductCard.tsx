import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsHeart, BsHeartHalf, BsHeartFill } from "react-icons/bs";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";
import { type ProductSchema } from "~/types/schema";
import { RiPlayMiniLine } from "react-icons/ri";
import { UseRouterFilter } from "~/utils/useRouterFilter";
import { api } from "~/utils/api";
import Link from "next/link";

interface ProductCardProps {
  product: ProductSchema;
}

function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const { asPath, query } = useRouter();
  const [previewHover, setPreviewHover] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [cartItem, setCartItem] = useState(false);
  const { handleRoute } = UseRouterFilter();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  // useEffect(() => (setAudio(new Audio(product.preview_url));), [product.preview_url]);

  const userWishlistQuery = api.userprofile.getWishlist.useQuery();
  const wishlistAddMutation =
    api.userprofile.addProductToWishlist.useMutation();
  const wishlistRemoveMutation =
    api.userprofile.deleteProductFromWishlist.useMutation();
  const handleWishlistAdd = () => {
    setFavorite(true);
    void wishlistAddMutation.mutateAsync({
      id: product.id,
    });
  };

  console.log(product);
  const handleWishlistRemove = () => {
    setFavorite(false);
    void wishlistRemoveMutation.mutateAsync({
      id: product.id,
    });
  };

  return (
    <div className="cardShadow my-4 flex h-60 w-40 flex-col justify-between rounded-b-lg rounded-r-lg bg-zinc-900 p-4 hover:bg-zinc-800">
      {" "}
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
      <Link
        href={{
          pathname: `/product/${product.id}`,
        }}
      >
        <h5 className="scrollbar-hide overflow-x-scroll whitespace-nowrap py-2 hover:cursor-pointer hover:underline hover:underline-offset-4">
          {product?.name}
        </h5>
      </Link>
      <Link
        href={{
          pathname: `/creator/${product?.seller.user.username}`,
        }}
      >
        <p className="text-sm text-gray-300 hover:cursor-pointer hover:underline hover:underline-offset-2">
          {product?.seller.user.username}
        </p>
      </Link>
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
        <h5 className="text-gray-200">${Number(product?.price)}</h5>
        <div className="flex items-center gap-2">
          {(userWishlistQuery.data &&
            userWishlistQuery.data.includes(product.id)) ||
          favorite ? (
            <BsHeartFill
              onClick={handleWishlistRemove}
              className="cursor-pointer hover:fill-zinc-500"
            />
          ) : (
            <BsHeart
              onClick={handleWishlistAdd}
              className="cursor-pointer hover:fill-zinc-500"
            />
          )}

          {cartItem ? (
            <HiShoppingCart
              size={20}
              className="cursor-pointer hover:fill-zinc-500"
            />
          ) : (
            <HiOutlineShoppingCart
              size={20}
              className="cursor-pointer hover:fill-zinc-500"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
