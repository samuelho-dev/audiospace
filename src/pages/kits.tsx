import React from "react";
import { BiSearchAlt } from "react-icons/bi";
import ProductCard from "~/components/ProductCard";
import FilterModule from "~/components/kits/FilterModule";
import { api } from "~/utils/api";
import { UseRouterFilter } from "~/utils/useRouterFilter";

function kits() {
  const categoryQuery = api.onload.getKitCategories.useQuery();
  const kitProductsQuery = api.kits.getPopularKits.useQuery();
  const { handleRoute } = UseRouterFilter();
  console.log(categoryQuery.data);
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8 lg:max-w-5xl">
      <div className="flex w-full justify-center gap-2 pt-10">
        <input
          type="text"
          className="h-6 w-1/2 rounded-lg bg-zinc-200 p-2 text-black"
        ></input>
        <div>
          <BiSearchAlt size={25} />
        </div>
      </div>
      {categoryQuery.data && (
        <FilterModule
          handleRoute={handleRoute}
          categories={categoryQuery.data}
        />
      )}
      <div>
        <h3>Featured Packs</h3>
        <div className="flex gap-4">
          {kitProductsQuery.data &&
            kitProductsQuery.data.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
      <div>
        <h3>New Releases</h3>
        <div className="flex gap-4">
          {kitProductsQuery.data &&
            kitProductsQuery.data.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
      <div>Rest</div>
    </div>
  );
}

export default kits;
