import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

function Wishlist() {
  const router = useRouter();
  const featuredInstrumentsQuery = api.user.getWishlistProducts.useQuery();
  console.log(featuredInstrumentsQuery.data);

  const wishlistRemoveMutation =
    api.user.deleteProductFromWishlist.useMutation();

  const handleWishlistRemove = async (id: string) => {
    await wishlistRemoveMutation.mutateAsync({
      id,
    });
    router.reload();
  };
  return (
    <div>
      <h2>Wishlist</h2>
      <div className="flex flex-col items-start gap-4">
        {featuredInstrumentsQuery.data &&
          featuredInstrumentsQuery.data.wishlist.map((product) => (
            <div
              key={product.id}
              className="flex w-full justify-between rounded-lg border border-zinc-500 p-2"
            >
              <div className="flex gap-4">
                <Image
                  src="https://res.cloudinary.com/ddhal4lbv/image/upload/v1680578842/audiospace/RC-20-Retro-Color-UI-Alpha_ue0qpp.png"
                  className="rounded-lg object-scale-down"
                  alt="productimg"
                  width={75}
                  height={75}
                  loading="lazy"
                />
                <h5>
                  {product.name} by {product.seller.user.username}
                </h5>
                <p>${Number(product.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button className="rounded-lg px-2 text-sm outline outline-1 outline-zinc-400 hover:bg-zinc-500">
                  Add to Cart
                </button>
                <button
                  onClick={() => void handleWishlistRemove(product.id)}
                  className="rounded-lg px-2 text-sm outline outline-1 outline-zinc-400 hover:bg-zinc-500"
                >
                  Remove from list
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Wishlist;
