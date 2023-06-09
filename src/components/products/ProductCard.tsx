import Image from "next/image";
import React, { useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";
import { type ProductSchema } from "~/types/schema";
import { RiPlayMiniLine } from "react-icons/ri";
import { api } from "~/utils/api";
import Link from "next/link";

interface ProductCardProps {
  product: ProductSchema;
}

function ProductCard({ product }: ProductCardProps) {
  const [previewHover, setPreviewHover] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [cart, setCart] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  // useEffect(() => (setAudio(new Audio(product.preview_url));), [product.preview_url]);

  const userWishlistQuery = api.user.getWishlist.useQuery();
  const userCartQuery = api.user.getCart.useQuery();

  const wishlistAddMutation = api.user.addProductToWishlist.useMutation();
  const wishlistRemoveMutation =
    api.user.deleteProductFromWishlist.useMutation();

  const cartAddMutation = api.user.addProductToCart.useMutation();
  const cartDeleteMutation = api.user.deleteProductFromCart.useMutation();

  const handleWishlistAdd = () => {
    setFavorite(true);
    void wishlistAddMutation.mutateAsync({
      id: product.id,
    });
  };
  const handleWishlistRemove = () => {
    setFavorite(false);
    void wishlistRemoveMutation.mutateAsync({
      id: product.id,
    });
  };

  const handleAddToCart = () => {
    setCart(true);
    void cartAddMutation.mutateAsync({
      id: product.id,
    });
  };
  const handleRemoveFromCart = () => {
    setCart(false);
    void cartDeleteMutation.mutateAsync({
      id: product.id,
    });
  };

  return (
    <div className="cardShadow my-4 flex h-64 w-40 flex-col justify-between rounded-b-lg rounded-r-lg bg-zinc-900 p-4 hover:bg-zinc-800">
      <div
        className="relative justify-center"
        onMouseOver={() => setPreviewHover(true)}
        onMouseOut={() => setPreviewHover(false)}
      >
        {previewHover && (
          <div className="absolute z-50 flex h-full w-full items-center justify-center rounded-lg bg-zinc-600 bg-opacity-50 hover:cursor-pointer">
            <RiPlayMiniLine size={30} className="fill-zinc-300" />
          </div>
        )}
        <div>
          <Image
            src={product.images[0]?.imageUrl as string}
            className="rounded-lg object-scale-down"
            alt="productimg"
            width={300}
            height={300}
            loading="lazy"
          />
        </div>
      </div>
      <Link
        href={{
          pathname: `/product/${product.id}`,
        }}
      >
        <h5 className="scrollbar-hide overflow-x-scroll whitespace-nowrap hover:cursor-pointer hover:underline hover:underline-offset-4">
          {product?.name}
        </h5>
      </Link>
      <Link
        href={{
          pathname: `/seller/${product?.seller.user.username}`,
        }}
      >
        <p className="text-sm text-gray-300 hover:cursor-pointer hover:underline hover:underline-offset-2">
          {product?.seller.user.username}
        </p>
      </Link>
      <div className="scrollbar-hide flex gap-1 overflow-scroll whitespace-nowrap">
        {product?.subcategory.map((subcategory, i) => (
          <p
            key={subcategory.id}
            className=" text-xs font-light tracking-tight text-gray-400"
          >
            {subcategory.name}
            {i !== product.subcategory.length - 1 && ","}
          </p>
        ))}
      </div>
      <div className="flex justify-between pt-1">
        <h5 className="text-gray-200">${Number(product?.price) / 100}</h5>
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
          {(userCartQuery.data && userCartQuery.data.includes(product.id)) ||
          cart ? (
            <HiShoppingCart
              onClick={handleRemoveFromCart}
              size={20}
              className="cursor-pointer hover:fill-zinc-500"
            />
          ) : (
            <HiOutlineShoppingCart
              onClick={handleAddToCart}
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
