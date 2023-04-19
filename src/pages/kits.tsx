import React from "react";
import FilterModule from "~/components/kits/FilterModule";
import { api } from "~/utils/api";
import { UseRouterFilter } from "~/utils/useRouterFilter";
import Main from "~/components/kits/Main";
import FilterProductView from "~/components/products/FilterProductView";
import { useRouter } from "next/router";
import Searchbar from "~/components/products/Searchbar";

function Kits() {
  const { handleRoute } = UseRouterFilter();
  const router = useRouter();
  const { category, tag } = router.query;
  const categoryQuery = api.onload.getKitCategories.useQuery();

  return (
    <div className="flex w-full max-w-3xl flex-col gap-8 lg:max-w-5xl">
      <Searchbar />
      {categoryQuery.data && (
        <FilterModule
          handleRoute={handleRoute}
          categories={categoryQuery.data}
        />
      )}
      {tag ? <FilterProductView /> : <Main />}
    </div>
  );
}

export default Kits;
