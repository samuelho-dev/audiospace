import React, { useState } from "react";
import { api } from "~/utils/api";
import Main from "~/components/plugin/Main";
import { useRouter } from "next/router";
import Sidebar from "~/components/plugin/Sidebar";

import { UseRouterFilter } from "~/utils/useRouterFilter";
import FilterProductView from "~/components/products/FilterProductView";
import FilterModule from "~/components/plugin/FilterModule";
import Searchbar from "~/components/products/Searchbar";

function Plugins() {
  const router = useRouter();
  const { category, tag } = router.query;
  const { handleRoute } = UseRouterFilter();
  const categoriesQuery = api.onload.getPluginCategories.useQuery();

  return (
    <div className="flex w-full max-w-3xl flex-col gap-8 lg:max-w-5xl">
      <Searchbar />
      {categoriesQuery.data && (
        <div className="flex w-full gap-4">
          <Sidebar
            categories={categoriesQuery.data}
            handleRoute={handleRoute}
          />
          <div>
            <FilterModule
              categories={categoriesQuery.data}
              handleRoute={handleRoute}
            />

            {category || tag ? <FilterProductView /> : <Main />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Plugins;
