import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { type CategorySchema } from "~/types/schema";

interface PluginSidebarProps {
  categories: CategorySchema[];
  handleRoute: Function;
}

function Sidebar({ categories, handleRoute }: PluginSidebarProps) {
  return (
    <div className="my-4 flex flex-col items-center border-r border-zinc-800 py-8 pr-2">
      {categories.map((category) => (
        <div key={category.id} className="flex w-full flex-col">
          <h4
            className="cursor-pointer whitespace-nowrap pb-2 pt-4"
            onClick={() => handleRoute(category.name)}
          >
            {category.name} ⬇️
          </h4>

          <div className="ml-2 flex flex-col gap-0.5">
            {category.subcategories.map((subcategory) => (
              <p
                key={subcategory.id}
                className="px-2 text-sm hover:bg-zinc-700"
                onClick={() => handleRoute(category.name, subcategory.name)}
              >
                {subcategory.name}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
