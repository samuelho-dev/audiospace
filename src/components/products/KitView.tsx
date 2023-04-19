import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import ProductCard from "./ProductCard";

function Main({}) {
  const featuredKitsQuery = api.products.getFeaturedProducts.useQuery({
    category: "Kits",
  });
  const newKitsQuery = api.products.getNewProducts.useQuery({
    category: "Kits",
  });
  console.log(newKitsQuery.data);
  return (
    <div className="w-full px-2 py-4">
      <div>
        <h3>Featured Packs</h3>
        <div className="flex gap-4">
          {featuredKitsQuery.data &&
            featuredKitsQuery.data.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
      <div>
        <h3>New Releases</h3>
        <div className="flex gap-4">
          {newKitsQuery.data &&
            newKitsQuery.data.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
