import React from "react";
import type { CategorySchema } from "~/types/schema";
import FilterModule from "~/components/products/FilterModule";
import FilterProductView from "~/components/products/FilterProductView";
import ProductSidebar from "~/components/products/ProductSidebar";
import PluginView from "~/components/products/PluginView";
import { useRouter } from "next/router";
import { UseRouterFilter } from "~/utils/useRouterFilter";
import KitView from "~/components/products/KitView";

interface MarketLayoutProps {
  categories: CategorySchema[];
}

function MarketLayout({ categories }: MarketLayoutProps) {
  const router = useRouter();
  const { category, tag } = router.query;
  const { handleRoute } = UseRouterFilter();
  console.log(router.pathname);

  const MainView =
    router.pathname === "/plugins" ? (
      <PluginView />
    ) : router.pathname === "/kits" ? (
      <KitView />
    ) : null;

  return (
    <div className="flex h-full w-full max-w-3xl flex-grow flex-col gap-8 py-10 lg:max-w-6xl">
      {categories && (
        <div className="flex w-full gap-4">
          <div className="w-1/5">
            <ProductSidebar categories={categories} handleRoute={handleRoute} />
          </div>
          <div className="w-4/5">
            <FilterModule categories={categories} handleRoute={handleRoute} />

            {category || tag ? <FilterProductView /> : MainView}
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketLayout;
