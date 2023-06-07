import Image from "next/image";
import React from "react";
import { api } from "~/utils/api";

function Cart() {
  const cartQuery = api.user.getCartProducts.useQuery();

  console.log(cartQuery.data);
  return (
    <div className="flex w-full max-w-3xl flex-grow flex-col gap-8 lg:max-w-6xl">
      <h1 className="border-b">Your Cart</h1>
      <div className="flex flex-col gap-2 border-b border-b-zinc-500">
        {cartQuery.data &&
          cartQuery.data.cart.map((product) => (
            <div
              key={product.id}
              className="flex w-full items-center justify-between bg-zinc-800 px-4 py-2"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={product.images[0]?.imageUrl as string}
                  className="rounded-lg object-scale-down"
                  alt="productimg"
                  width={100}
                  height={100}
                  loading="lazy"
                />
                <h3>
                  {product.name} - {product.seller.user.username}
                </h3>
              </div>
              <div className="flex h-full items-center gap-4">
                <input
                  type="number"
                  value={1}
                  className="h-fit w-20 text-lg font-medium text-black"
                />
                <h3 className="w-20">${Number(product.price)}</h3>
              </div>
            </div>
          ))}
      </div>
      <div className="flex justify-between">
        <h3>Total</h3>
        <h3>$PRICE</h3>
      </div>
    </div>
  );
}

export default Cart;
