import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import FilterModule from "~/components/products/FilterModule";
import ProductCard from "~/components/products/ProductCard";
import { api } from "~/utils/api";

// interface sellerProfileProps {
//   userId : string
// }

function SellerProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const { user } = router.query;
  if (!user) {
    return null;
  }
  const productQuery =
    api.sellerprofile.getSellerProfileProductandCategories.useQuery({
      userId: user as string,
    });
  console.log(productQuery.data);
  return (
    <div className="flex w-full max-w-3xl flex-grow flex-col justify-start gap-8 lg:max-w-6xl">
      <div className="flex justify-between border-b border-zinc-800 p-4">
        <div className="flex h-40 items-center gap-4 py-4">
          <div className="flex h-20 w-20 border-spacing-8 items-center justify-center rounded-lg border border-zinc-100">
            <h5>😛</h5>
          </div>
          <div className="flex flex-col items-baseline">
            <h3>{user}</h3>
            <sub>{"joined"}</sub>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2">
          <div className="flex items-center gap-2">
            {session?.user.id === user ||
              (session?.user.role === "ADMIN" && (
                <Link
                  href={"/seller/new-item"}
                  className="h-fit rounded-lg border p-2"
                >
                  Add Product
                </Link>
              ))}
            <div className="rounded-md bg-zinc-100 p-1 text-black">Share</div>
          </div>
          <div className="flex justify-end gap-2">
            <div>Rating</div>
            <div>Transactions</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="mx-4 flex w-1/4 border-spacing-4 flex-col gap-2 border-r border-zinc-100">
          <h5 className="mx-2 bg-zinc-800 px-2 hover:bg-zinc-100 hover:text-black">
            Profile
          </h5>
          <h5 className="mx-2 bg-zinc-800 px-2 hover:bg-zinc-100 hover:text-black">
            Sales History
          </h5>
          <h5 className="mx-2 bg-zinc-800 px-2 hover:bg-zinc-100 hover:text-black">
            Payments
          </h5>
        </div>
        <div className="w-full">
          <div>
            {!productQuery.data || productQuery.data.products.length === 0 ? (
              <h5>There are no products to display.</h5>
            ) : (
              productQuery.data.products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerProfile;
