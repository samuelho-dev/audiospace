import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import UserNav from "~/components/UserNav";
import AuthModal from "~/components/auth/AuthModal";
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

interface PluginDropdownProps {
  categories: Category[];
  handleDropdown: (dropdownName: string | null) => void;
  route: string;
}

function PluginDropdown({
  categories,
  handleDropdown,
  route,
}: PluginDropdownProps) {
  return (
    <div
      onMouseLeave={() => handleDropdown(null)}
      className="absolute left-0 top-0 z-10 h-fit w-full translate-y-14 justify-center gap-1 rounded-b-lg bg-gradient-to-b from-[#191919] to-[#101010] py-2 opacity-90"
    >
      <div className="flex w-full flex-col items-center justify-between">
        {categories.map((category) => (
          <div
            key={category.id}
            className="grid w-full max-w-3xl grid-cols-[1fr_4fr] justify-between py-4"
          >
            <div className="">
              <h4 className="whitespace-nowrap text-white">
                {category.name} ➡️
              </h4>
            </div>
            <div className="grid grid-cols-4 border-l-2 border-white pl-2">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="hover:bg-slate-300 ">
                  <Link
                    href={{
                      pathname: route,
                      query: {
                        tag: subcategory.name.toLowerCase().replace(" ", "-"),
                      },
                    }}
                  >
                    <p className="whitespace-pre-wrap text-white hover:text-black">
                      {subcategory.name}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Navbar() {
  const { data: session } = useSession();

  const pluginCategoriesQuery = api.onload.getPluginCategories.useQuery();
  const kitCategoriesQuery = api.onload.getKitCategories.useQuery();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdown = (dropdownName: string | null) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <nav className="top flex w-full max-w-3xl items-center justify-between gap-4 lg:max-w-5xl">
      <Link href={"/"} className="z-20">
        <h1>audio.space</h1>
      </Link>
      <div className="flex items-center justify-center gap-4">
        <Link
          href={"/plugins"}
          onMouseOver={() => handleDropdown("PluginDropdown")}
        >
          <h4>Plugins</h4>
        </Link>
        <Link href={"/kits"} onMouseOver={() => handleDropdown("KitDropdown")}>
          <h4>Kits</h4>
        </Link>
        <Link href={"/deals"}>
          <h4>Deals</h4>
        </Link>
        <Link href={"/battles"}>
          <h4>Battles</h4>
        </Link>
      </div>
      {activeDropdown === "PluginDropdown" && pluginCategoriesQuery.data && (
        <PluginDropdown
          route={"/plugins"}
          handleDropdown={handleDropdown}
          categories={pluginCategoriesQuery.data}
        />
      )}
      {activeDropdown === "KitDropdown" && kitCategoriesQuery.data && (
        <PluginDropdown
          route={"/kits"}
          handleDropdown={handleDropdown}
          categories={kitCategoriesQuery.data}
        />
      )}
      <div className="flex items-center">
        {!session ? (
          <button
            onClick={() => handleDropdown("AuthModal")}
            className="rounded-full bg-yellow-300 px-4 py-1 text-black"
          >
            Sign In
          </button>
        ) : (
          <UserNav
            handleDropdown={handleDropdown}
            activeDropdown={activeDropdown}
          />
        )}
        <button className="z-20">
          <h3 className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            🛒
          </h3>
        </button>
        {activeDropdown === "AuthModal" && (
          <AuthModal handleDropdown={handleDropdown} />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
