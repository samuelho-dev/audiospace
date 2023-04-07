import Link from "next/link";
import React from "react";
import ProductCard from "~/components/ProductCard";
import { api } from "~/utils/api";

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

interface PluginSidebarProps {
  categories: Category[];
}

function Sidebar({ categories }: PluginSidebarProps) {
  return (
    <div className="flex w-1/6 flex-col items-center">
      {categories.map((category) => (
        <div key={category.id} className="flex w-full flex-col">
          <Link href={`/plugins/${category.name}`}>
            <h4 className="whitespace-nowrap pb-2 pt-4">{category.name}s ⬇️</h4>
          </Link>
          <div className="ml-2 flex flex-col gap-0.5">
            {category.subcategories.map((subcategory) => (
              <p
                key={subcategory.id}
                className="px-2 text-sm hover:bg-gray-800"
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

function Plugins() {
  const categoriesQuery = api.onload.getCategories.useQuery();
  return (
    <div className="h-full max-w-3xl lg:max-w-5xl">
      <div className="flex justify-center">
        <input type="text"></input>
      </div>
      <div className="flex w-full justify-between">
        {categoriesQuery.data && <Sidebar categories={categoriesQuery.data} />}
        <div className="w-10/12">
          <h2>Instruments ⬇️</h2>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h3>Popular Instruments</h3>
              <div className="bg-white">
                <button className="w-6" />
                <button>h</button>
              </div>
            </div>
            <div className="flex overflow-x-clip">
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plugins;
