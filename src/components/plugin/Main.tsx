import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import ProductCard from "../ProductCard";

function Main({}) {
  const featuredInstrumentsQuery = api.plugins.getPopularInstruments.useQuery();
  const featuredEffectsQuery = api.plugins.getPopularEffects.useQuery();

  return (
    <div className="w-full px-2">
      <div className="flex flex-col">
        <h3>Instruments ⬇️</h3>
        <div className="flex items-center justify-between">
          <h4>Popular Instruments</h4>
        </div>
        <div className="flex gap-4 overflow-x-clip px-4 py-2">
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
        <div className="flex gap-4 overflow-x-clip px-4 py-2">
          {featuredEffectsQuery.data &&
            featuredEffectsQuery.data.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
