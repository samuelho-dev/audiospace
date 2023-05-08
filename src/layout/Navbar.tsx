import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import UserNav from "~/components/profile/UserNav";
import AuthModal from "~/components/auth/AuthModal";
import { api } from "~/utils/api";
import { BiSearchAlt } from "react-icons/bi";

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
      className="absolute left-0 top-0 z-10 h-fit w-full translate-y-24 justify-center gap-1 rounded-b-lg border-b border-zinc-600 bg-gradient-to-b from-[#191919] to-[#101010] py-2 opacity-90"
    >
      <div className="flex w-full flex-col items-center justify-between">
        {categories.map((category) => (
          <div
            key={category.id}
            className="grid w-full max-w-3xl grid-cols-[1fr_4fr] justify-between py-4"
          >
            <h4 className="whitespace-nowrap text-white">{category.name} ➡️</h4>

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
  {
  }
  return (
    <nav className="top flex w-full max-w-3xl flex-col items-center justify-between lg:max-w-5xl">
      <div className="flex h-10 w-full items-center justify-between">
        <Link href={"/"} className="z-20">
          <h1>audiospace</h1>
        </Link>
        <div className="absolute left-1/2 flex w-1/4 -translate-x-1/2 items-center justify-center font-bold">
          <input
            type="text"
            className="h-6 w-full rounded-sm bg-zinc-100 text-black"
          />
          <BiSearchAlt className="ml-[-10%]" fill="darkgray" size={20} />
        </div>
        <div className="flex items-center gap-2">
          {!session ? (
            <div className="flex gap-4">
              <button
                onClick={() => handleDropdown("AuthModal")}
                className="border border-zinc-500 px-4 font-bold tracking-widest"
              >
                Sell
              </button>
              <button
                onClick={() => handleDropdown("AuthModal")}
                className="rounded-full bg-yellow-300 px-4 py-1 font-bold tracking-wide text-black"
              >
                Sign In
              </button>
            </div>
          ) : (
            <>
              <UserNav
                handleDropdown={handleDropdown}
                activeDropdown={activeDropdown}
              />
              <Link href={"/cart"}>
                <button className="z-20 flex items-center justify-center rounded-full bg-white px-2 py-1 text-lg">
                  🛒
                </button>
              </Link>
            </>
          )}

          {activeDropdown === "AuthModal" && (
            <AuthModal handleDropdown={handleDropdown} />
          )}
        </div>
      </div>

      <div className="my-2 flex gap-8">
        <Link
          href={"/plugins"}
          onMouseOver={() => handleDropdown("PluginDropdown")}
        >
          <h4 className="text-md tracking-wide">PLUGINS</h4>
        </Link>
        <Link href={"/kits"} onMouseOver={() => handleDropdown("KitDropdown")}>
          <h4 className="text-md tracking-wide">KITS</h4>
        </Link>
        <Link href={"/community"}>
          <h4 className="text-md tracking-wide">COMMUNITY</h4>
        </Link>
        <Link href={"/hi-pass"}>
          <h4 className="text-md tracking-wide">READ</h4>
        </Link>
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
      </div>
    </nav>
  );
}

export default Navbar;
