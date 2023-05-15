import { PrismaClient } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";

import { type GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { type ProductSchema } from "~/types/schema";

interface ProductPageProps {
  product: ProductSchema;
}

const RenderEditor = dynamic(
  () => import("~/components/text-editor/RenderEditor"),
  {
    ssr: false,
  }
);
function ProductPage({ product }: ProductPageProps) {
  const router = useRouter();

  // NEED TO FETCH RATINGS FOR SELLER AND PRODUCT

  return (
    <div className="flex w-full max-w-3xl flex-grow flex-col gap-8 lg:max-w-4xl">
      <div className="flex w-full border-b border-zinc-200 p-10">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-8">
            <Image
              src={product.images[0]?.imageUrl as string}
              alt="product image"
              width={200}
              height={200}
              className="rounded-sm"
              loading="lazy"
            />
            <div>
              <h2>{product.name}</h2>
              <div className="flex w-full items-center justify-between gap-2">
                {product.seller.user.image && (
                  <Image
                    src={product.seller.user.image}
                    alt="product image"
                    width={30}
                    height={30}
                    className="rounded-full"
                    loading="lazy"
                  />
                )}
                <h5>{product.seller.user.username}</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-1/5 flex-col items-end justify-end gap-4">
          <button className="w-full bg-zinc-100 p-2 text-center tracking-wide text-black hover:mx-3 ">
            Add to Cart
          </button>
          <button className="w-full border px-2 hover:mx-3">Favorite</button>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="w-full">
          <div className="grid grid-cols-2 p-2 px-2">
            <h4 className="h-full border px-2">
              {product.seller.user.username}
            </h4>
            <h4 className="h-full border px-2">Total Rating</h4>
          </div>
          {product.description && (
            <RenderEditor content={product.description} />
          )}
        </div>
        <div className="w-1/3">
          <h3>Ratings</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap rounded-md text-sm">
                5 stars
              </label>
              <meter
                aria-label="5 stars"
                value="0.5"
                className="h-4 w-full"
              ></meter>
            </div>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap rounded-md text-sm">
                4 stars
              </label>
              <meter
                aria-label="4 stars"
                value="1"
                className="h-4 w-full"
              ></meter>
            </div>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap rounded-md text-sm">
                3 stars
              </label>
              <meter
                aria-label="3 stars"
                value="1"
                className="h-4 w-full"
              ></meter>
            </div>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap rounded-md text-sm">
                2 stars
              </label>
              <meter
                aria-label="2 stars"
                value="1"
                className="h-4 w-full"
              ></meter>
            </div>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap rounded-md text-sm">
                1 stars
              </label>
              <meter
                aria-label="1 stars"
                value="1"
                className="h-4 w-full"
              ></meter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const prisma = new PrismaClient();
  if (!id) {
    return {
      notFound: true,
    };
  }
  const data = await prisma.product.findFirstOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      seller: {
        select: {
          user: {
            select: {
              image: true,
              username: true,
            },
          },
        },
      },
      description: true,
      subcategory: true,
      category: true,
      name: true,
      images: true,
      price: true,
      ratings: true,
      previewUrl: true,
      discountRate: true,
      wishlistUsers: true,
    },
  });
  type Content = {
    data: Buffer;
  };
  const content: Content = data.description;
  const contentData = content.data.toString("utf-8");
  await prisma.$disconnect();

  return {
    props: {
      product: { ...data, description: contentData },
    },
  };
};
