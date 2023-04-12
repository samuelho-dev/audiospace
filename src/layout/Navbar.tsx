import { ProductCategory } from "@prisma/client";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { SetStateAction, useEffect, useState } from "react";
import { z } from "zod";
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
}

function PluginDropdown({ categories }: PluginDropdownProps) {
  return (
    <div className="absolute left-0 top-0 z-10 h-fit w-full translate-y-14 justify-center gap-1 rounded-b-lg bg-gradient-to-b from-[#191919] to-[#101010] py-2 opacity-90">
      <div className="flex w-full flex-col items-center justify-between">
        {categories.map((category) => (
          <div
            key={category.id}
            className="grid w-full max-w-3xl grid-cols-[1fr_4fr] justify-between py-4"
          >
            <div className="">
              <h4 className="whitespace-nowrap text-white">
                {category.name}s ➡️
              </h4>
            </div>
            <div className="grid grid-cols-4 border-l-2 border-white pl-2">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="hover:bg-slate-300 ">
                  <Link
                    href={`/plugins/${category.name.toLowerCase()}/${subcategory.name.toLowerCase()}`}
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

  const categoriesQuery = api.onload.getCategories.useQuery();
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    void fetchCsrfToken();
  }, []);

  const handleDropdown = (dropdownName: string | null) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <nav className="top flex w-full max-w-3xl items-center justify-between gap-4 lg:max-w-5xl">
      <Link href={"/"} className="z-20">
        <h1>audio.space</h1>
      </Link>
      <div className="flex items-center justify-center gap-6">
        <Link
          href={"/plugins"}
          onMouseOver={() => handleDropdown("PluginDropdown")}
        >
          <h3>Plugins</h3>
        </Link>
        <Link href={"/kits"}>
          <h3>Kits</h3>
        </Link>
        <Link href={"/deals"}>
          <h3>Deals</h3>
        </Link>
        <Link href={"/battles"}>
          <h3>Battles</h3>
        </Link>
      </div>
      {activeDropdown === "PluginDropdown" && categoriesQuery.data && (
        <PluginDropdown categories={categoriesQuery.data} />
      )}
      <div className="flex items-center gap-4">
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
        {activeDropdown === "AuthModal" && csrfToken && (
          <AuthModal csrfToken={csrfToken} handleDropdown={handleDropdown} />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
