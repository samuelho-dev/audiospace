import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import ProductCard from "./ProductCard";

function PluginView({}) {
  const featuredInstrumentsQuery = api.products.getFeaturedProducts.useQuery({
    category: "Instruments",
  });
  const featuredEffectsQuery = api.products.getFeaturedProducts.useQuery({
    category: "Effects",
  });

  return (
    <div className="w-full px-2 py-4">
      <div className="flex flex-col">
        <h3>Instruments ⬇️</h3>
        <h4>Popular Instruments</h4>
        <div className="scrollbar-hide flex w-full gap-4 overflow-hidden overflow-x-scroll px-2 py-2">
          {featuredInstrumentsQuery.data &&
            featuredInstrumentsQuery.data.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
        </div>
      </div>
      <div className="flex flex-col">
        <h3>Effects ⬇️</h3>
        <div className="flex items-center justify-between">
          <h4>Popular Effects</h4>
        </div>
        <div className="scrollbar-hide flex gap-4 overflow-x-scroll px-2 py-2">
          {featuredEffectsQuery.data &&
            featuredEffectsQuery.data.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default PluginView;
