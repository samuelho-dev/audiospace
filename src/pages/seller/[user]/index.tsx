import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import FilterModule from "~/components/products/FilterModule";
import ProductCard from "~/components/products/ProductCard";
import {
  type CategorySchema,
  type ProductSchema,
  type SubcategorySchema,
} from "~/types/schema";
import { api } from "~/utils/api";

interface sellerProfileProps {
  products: ProductSchema[];
  categories: CategorySchema;
  subcategories: SubcategorySchema;
}

function SellerProfile({
  products,
  categories,
  subcategories,
}: sellerProfileProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { user } = router.query;
  if (!user) {
    return null;
  }
  console.log({ products, categories, subcategories });
  return (
    <div className="flex w-full max-w-3xl flex-grow flex-col justify-start gap-8 lg:max-w-6xl">
      <div className="z-10 flex justify-between border-b border-zinc-800 p-4">
        <div className="absolute -z-10 flex h-40 w-full max-w-3xl border-spacing-8 -translate-x-4 items-center justify-center rounded-md border border-zinc-100 bg-zinc-500 p-4 lg:max-w-6xl">
          IMAGE
        </div>
        <div className="flex h-52 w-full items-center gap-4 py-4">
          <div className="flex h-40 w-40 border-spacing-8 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-800">
            <h5>😛</h5>
          </div>
          <div className="flex flex-col items-baseline">
            <h3>{user}</h3>
            <sub>{"joined"}</sub>
          </div>
        </div>

        <div className="flex  flex-col justify-end gap-2">
          <div className="flex items-center gap-2">
            {session?.user.id === user ||
              (session?.user.role === "ADMIN" && (
                <Link
                  href={"/seller/new-item"}
                  className="h-fit whitespace-nowrap rounded-lg border bg-zinc-900 p-2"
                >
                  Add Product
                </Link>
              ))}
            <div className="rounded-md bg-zinc-100 px-2 py-1 text-black">
              Share
            </div>
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
            {!products || products.length === 0 ? (
              <h5>There are no products to display.</h5>
            ) : (
              products.map((product) => (
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const prisma = new PrismaClient();
  const username = params?.user as string;
  const data = await prisma.product.findMany({
    where: {
      seller: {
        user: {
          username: username,
        },
      },
    },
    select: {
      id: true,
      seller: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      description: true,
      category: true,
      subcategory: true,
      name: true,
      images: true,
      price: true,
      discountRate: true,
    },
  });

  const uniqueCategories = new Set();
  const uniqueSubcategories = new Set();

  for (const product of data) {
    uniqueCategories.add(product.category);
    uniqueSubcategories.add(product.subcategory);
  }
  const result = {
    products: data,
    categories: Array.from(uniqueCategories),
    subcategories: Array.from(uniqueSubcategories),
  };

  console.log(data);
  await prisma.$disconnect();

  return {
    props: result,
  };
};
