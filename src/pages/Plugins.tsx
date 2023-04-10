import React, { useState } from "react";
import { api } from "~/utils/api";
import Main from "~/components/plugin/main";
import { useRouter } from "next/router";
import { type CategorySchema } from "~/types/schema";
import Sidebar from "~/components/plugin/Sidebar";
import { BiSearchAlt } from "react-icons/bi";
import FilterBtn from "~/components/buttons/FilterBtn";
import { useRouterFilter } from "~/utils/useRouterFilter";

interface FilterProps {
  categories: CategorySchema[];
  handleRoute: Function;
}

interface ProfileRouteProps {
  route?: string;
}

function Filters({ categories, handleRoute }: FilterProps) {
  const handleCategoryClick = (categoryName: string) => {
    handleRoute(categoryName);
  };

  const handleSubcategoryClick = (
    categoryName: string,
    subcategoryName: string
  ) => {
    handleRoute(categoryName, subcategoryName);
  };
  return (
    <div className="flex w-full flex-col justify-center gap-4 rounded-lg p-4 outline outline-1 outline-zinc-700">
      <div className="flex gap-2">
        <h5>Types :</h5>
        <div className="flex gap-3">
          {categories.map((category) => (
            <FilterBtn key={category.id}>
              <p onClick={() => handleCategoryClick(category.name)}>
                {category.name}
              </p>
            </FilterBtn>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h5>Tags</h5>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <>
              {category.subcategories.map((subcategory) => (
                <FilterBtn key={subcategory.id}>
                  <div
                    className="flex gap-2"
                    onClick={() =>
                      handleSubcategoryClick(category.name, subcategory.name)
                    }
                  >
                    <p className="text-xs">{subcategory.name}</p>
                    <p className="text-xs text-zinc-400">
                      {subcategory._count.products}
                    </p>
                  </div>
                </FilterBtn>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
function FilterProductView() {
  return <div>Filter</div>;
}

function Plugins() {
  const router = useRouter();
  const { category, tag } = router.query;
  const { handleRoute } = useRouterFilter();
  console.log(category, tag);
  const categoriesQuery = api.onload.getCategories.useQuery();
  const productsQuery = api.products.getFilteredProducts.useQuery({
    categories: Array.isArray(category) ? category : [],
    subcategories: Array.isArray(tag) ? tag : [],
  });
  console.log(productsQuery);

  return (
    <div className="flex min-h-screen w-full max-w-3xl gap-8 lg:max-w-5xl">
      {categoriesQuery.data && (
        <Sidebar categories={categoriesQuery.data} handleRoute={handleRoute} />
      )}
      <div className="flex w-full flex-col gap-4 pt-12">
        <div className="flex w-full justify-center gap-2">
          <input
            type="text"
            className="h-6 w-1/2 rounded-lg bg-zinc-200 p-2 text-black"
          ></input>
          <div className="[ml]-10">
            <BiSearchAlt size={25} />
          </div>
        </div>
        {categoriesQuery.data && (
          <Filters
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
