import React, { useState } from "react";
import { api } from "~/utils/api";
import Main from "~/components/plugin/Main";
import { useRouter } from "next/router";
import { type CategorySchema } from "~/types/schema";
import Sidebar from "~/components/plugin/Sidebar";
import { BiSearchAlt } from "react-icons/bi";
import FilterBtn from "~/components/buttons/FilterBtn";
import { useRouterFilter } from "~/utils/useRouterFilter";
import FilterProductView from "~/components/plugin/FilterProductView";
import FilterModule from "~/components/plugin/FilterModule";

interface ProfileRouteProps {
  route?: string;
}

function Plugins() {
  const router = useRouter();
  const { category, tag } = router.query;
  const { handleRoute } = useRouterFilter();
  const categoriesQuery = api.onload.getCategories.useQuery();

  return (
    <div className="flex w-full max-w-3xl gap-8 lg:max-w-5xl">
      {categoriesQuery.data && (
        <Sidebar categories={categoriesQuery.data} handleRoute={handleRoute} />
      )}
      <div className="flex w-full flex-col gap-4 pt-12">
        <div className="flex w-full justify-center gap-2">
          <input
            type="text"
            className="h-6 w-1/2 rounded-lg bg-zinc-200 p-2 text-black"
          ></input>
          <div>
            <BiSearchAlt size={25} />
          </div>
        </div>
        {categoriesQuery.data && (
          <FilterModule
            categories={categoriesQuery.data}
            handleRoute={handleRoute}
          />
        )}
        {category || tag ? <FilterProductView /> : <Main />}

        {/* <PluginRoute route={getRoute(section)} /> */}
      </div>
    </div>
  );
}

export default Plugins;
