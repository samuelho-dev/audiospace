import React from "react";
import { api } from "~/utils/api";
import Main from "~/components/plugin/main";
import { useRouter } from "next/router";
import { type CategorySchema } from "~/types/schema";
import Sidebar from "~/components/plugin/Sidebar";
import { BiSearchAlt } from "react-icons/bi";

interface FilterProps {
  categories: CategorySchema[];
}

interface ProfileRouteProps {
  route?: string;
}

function getRoute(section: string | string[] | undefined): string {
  return typeof section === "string" ? section : "";
}

function PluginRoute({ route }: ProfileRouteProps) {
  console.log(route);
  switch (route) {
    case "":
      return <Main />;
    case "effect":
      return <Main />;
    case "instrument":
      return <Main />;
    default:
      return <Main />;
  }
}

function Filters({ categories }: FilterProps) {
  return (
    <div className="flex w-full flex-col justify-center gap-4 rounded-lg p-4 outline outline-1 outline-zinc-700">
      <div className="flex gap-2">
        <h5>Types :</h5>
        <div className="flex gap-3">
          {categories.map((category) => (
            <p
              key={category.id}
              className="cursor-pointer rounded-lg px-2 py-1 text-xs outline outline-1 outline-zinc-400 hover:bg-zinc-700"
            >
              {category.name}
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h5>Tags</h5>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <>
              {category.subcategories.map((subcategories) => (
                <div
                  key={subcategories.id}
                  className="flex w-fit cursor-pointer items-center justify-center gap-4 rounded-lg px-2 py-1 pl-2 outline outline-1 outline-zinc-400 hover:bg-zinc-700"
                >
                  <p className="text-xs">{subcategories.name}</p>
                  <p className="text-xs text-zinc-400">
                    {subcategories._count.products}
                  </p>
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

function Plugins() {
  const router = useRouter();
  const { filter } = router.query;
  const categoriesQuery = api.onload.getCategories.useQuery();
  const productsQuery = api.products.getProducts.useQuery({
    text: "Distortion",
  });
  console.log(productsQuery);
  return (
    <div className="flex min-h-screen w-full max-w-3xl gap-8 lg:max-w-5xl">
      {categoriesQuery.data && <Sidebar categories={categoriesQuery.data} />}
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
        {categoriesQuery.data && <Filters categories={categoriesQuery.data} />}

        {/* <PluginRoute route={getRoute(section)} /> */}
      </div>
    </div>
  );
}

export default Plugins;
