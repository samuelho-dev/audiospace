import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface UserNavProps {
  handleDropdown: (dropdownName: string | null) => void;
  activeDropdown: string | null;
}

function UserNav({ handleDropdown, activeDropdown }: UserNavProps) {
  const { data: session } = useSession();
  if (!session || !session.user) {
    return null;
  }
  return (
    <div className="flex cursor-pointer flex-col">
      <div
        className="mr-[-10%] flex w-fit items-center"
        onClick={() => handleDropdown("ProfileDropdown")}
      >
        <h5
          className={`mr-[-10%] h-6 w-36 overflow-clip bg-white px-6 text-center text-sm font-medium text-black ${
            activeDropdown === "ProfileDropdown" ? "rounded-t-lg" : "rounded-lg"
          }`}
        >
          {session?.user.name}
        </h5>
        <div
          className={`z-50 rounded-full ${
            !session.user.image ? "bg-pink-300 px-2 " : "w-fit"
          }`}
          // onClick={() => void signOut()}
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              width={45}
              height={45}
              alt="profile-image"
              className="rounded-full"
            />
          ) : (
            <h1 className="flex h-full w-full items-center justify-center">
              😛
            </h1>
          )}

          {/* <Image
            src=""
            alt="pfp"
            className="flex h-full w-full items-center justify-center "
          /> */}
        </div>
      </div>
      {activeDropdown === "ProfileDropdown" && (
        <ul
          onMouseLeave={() => handleDropdown(null)}
          className="absolute z-20 flex w-40 translate-y-10 flex-col gap-1 rounded-b-lg bg-white px-4 py-2"
        >
          <Link
            href={{
              pathname: "/profile",
              query: { section: "basic-info" },
            }}
          >
            <li className=" text-sm text-gray-700 hover:bg-slate-300">
              Profile
            </li>
          </Link>
          <Link
            href={{
              pathname: "/profile",
              query: { section: "submissions" },
            }}
          >
            <li className="text-sm text-gray-700 hover:bg-slate-300">
              Submissions
            </li>
          </Link>
          <Link
            href={{
              pathname: "/profile",
              query: { section: "wishlist" },
            }}
          >
            <li className="text-sm text-gray-700 hover:bg-slate-300">
              Wishlist
            </li>
          </Link>
          {session?.user.role !== "SELLER" && (
            <Link
              href={{
                pathname: `/seller/${session?.user.name}`,
              }}
            >
              <li className="text-sm text-gray-700 hover:bg-slate-300">
                Seller Dashboard
              </li>
            </Link>
          )}
          {session?.user.role === "ADMIN" && (
            <Link
              href={{
                pathname: "/profile",
                query: { section: "admin-panel" },
              }}
            >
              <li className=" cursor-pointer bg-zinc-500 text-sm text-red-300 hover:bg-slate-300">
                ADMIN PANEL
              </li>
            </Link>
          )}
          <li
            className="w-full cursor-pointer text-sm text-gray-700 hover:bg-slate-300"
            onClick={() => void signOut()}
          >
            Log Out
          </li>
        </ul>
      )}
    </div>
  );
}

export default UserNav;
