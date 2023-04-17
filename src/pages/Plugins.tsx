import React, { useState } from "react";
import { api } from "~/utils/api";
import Main from "~/components/plugin/Main";
import { useRouter } from "next/router";
import { type CategorySchema } from "~/types/schema";
import Sidebar from "~/components/plugin/Sidebar";
import { BiSearchAlt } from "react-icons/bi";
import FilterBtn from "~/components/buttons/FilterBtn";
import { UseRouterFilter } from "~/utils/useRouterFilter";
import FilterProductView from "~/components/plugin/FilterProductView";
import FilterModule from "~/components/plugin/FilterModule";

interface ProfileRouteProps {
  route?: string;
}

function Plugins() {
  const router = useRouter();
  const { category, tag } = router.query;
  const { handleRoute } = UseRouterFilter();
  const categoriesQuery = api.onload.getPluginCategories.useQuery();

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
      <div className="flex w-full gap-4">
        {categoriesQuery.data && (
          <Sidebar
            categories={categoriesQuery.data}
            handleRoute={handleRoute}
          />
        )}
        <div>
          {categoriesQuery.data && (
            <FilterModule
              categories={categoriesQuery.data}
              handleRoute={handleRoute}
            />
          )}
          {category || tag ? <FilterProductView /> : <Main />}
        </div>
        {/* <PluginRoute route={getRoute(section)} /> */}
      </div>
    </div>
  );
}

export default Plugins;
