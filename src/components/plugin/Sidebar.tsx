import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { type CategorySchema } from "~/types/schema";

interface PluginSidebarProps {
  categories: CategorySchema[];
}

function Sidebar({ categories }: PluginSidebarProps) {
  const router = useRouter();

  const PluginsNavigation = (section: string) => {
    router
      .push(`/plugins?category=${section}`, undefined, { shallow: true })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex w-1/6 flex-col items-center py-12">
      {categories.map((category) => (
        <div key={category.id} className="flex w-full flex-col">
          <h4
            className="cursor-pointer whitespace-nowrap pb-2 pt-4"
            onClick={() => PluginsNavigation(`${category.name.toLowerCase()}`)}
          >
            {category.name} ⬇️
          </h4>

          <div className="ml-2 flex flex-col gap-0.5">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/plugins/${category.name
                  .toLowerCase()
                  .replace(" ", "-")}/${subcategory.name
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                <p className="px-2 text-sm hover:bg-gray-800">
                  {subcategory.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
