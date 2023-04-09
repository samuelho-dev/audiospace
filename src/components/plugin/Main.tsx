import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import ProductSideScrollBtn from "../buttons/ProductSideScrollBtn";
import ProductCard from "../ProductCard";
import { type Session } from "next-auth";
import { type ProductSchema } from "~/types/schema";

function Main({}) {
  const featuredProductsQuery = api.onload.getFeaturedProducts.useQuery();

  return (
    <div className="w-full px-2">
      <div className="flex flex-col">
        <h3>Instruments ⬇️</h3>
        <div className="flex items-center justify-between">
          <h4>Popular Instruments</h4>
          <ProductSideScrollBtn />
        </div>
        <div className="flex gap-4 overflow-x-clip px-4 py-2">
          {featuredProductsQuery.data &&
            featuredProductsQuery.data.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
        </div>
      </div>
      <div className="flex flex-col">
        <h3>Effects ⬇️</h3>
        <div className="flex items-center justify-between">
          <h4>Popular Effects</h4>
          <ProductSideScrollBtn />
        </div>
        <div className="flex gap-4 overflow-x-clip px-4 py-2">
          {featuredProductsQuery.data &&
            featuredProductsQuery.data.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
