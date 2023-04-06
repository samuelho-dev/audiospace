import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface UserNavProps {
  pluginDropdownActive: boolean;
}

function UserNav({ pluginDropdownActive }: UserNavProps) {
  const { data: session } = useSession();
  const [dropdownActive, setDropdownActive] = useState(false);

  const handleDropdown = () => {
    if (pluginDropdownActive) return;
    setDropdownActive(!dropdownActive);
  };

  return (
    <div className="flex flex-col">
      <div className="z-20 flex items-center" onClick={handleDropdown}>
        <h5
          className={`mr-[-10%] h-6 w-40 overflow-clip bg-white px-6 text-center text-sm text-black ${
            dropdownActive ? "rounded-t-lg" : "rounded-lg"
          }`}
        >
          {session?.user.name}
        </h5>
        <div
          className="h-12 w-12 rounded-full bg-pink-300"
          // onClick={() => void signOut()}
        >
          <h1 className="z-20 flex h-full w-full items-center justify-center">
            😛
          </h1>

          {/* <Image
            src=""
            alt="pfp"
            className="flex h-full w-full items-center justify-center "
          /> */}
        </div>
      </div>
      {dropdownActive && !pluginDropdownActive && (
        <ul className="absolute z-10 flex w-40 translate-y-10 flex-col gap-1 rounded-b-lg bg-white py-2">
          <Link href={"/profile"}>
            <li className="w-full pl-8 text-sm text-gray-700 hover:bg-slate-300">
              Profile
            </li>
          </Link>
          <Link
            href={{
              pathname: "/profile",
              query: { section: "submissions" },
            }}
          >
            <li className="w-full pl-8 text-sm text-gray-700 hover:bg-slate-300">
              Submissions
            </li>
          </Link>
          <Link
            href={{
              pathname: "/profile",
              query: { section: "wishlist" },
            }}
          >
            <li className="w-full pl-8 text-sm text-gray-700 hover:bg-slate-300">
              Wishlist
            </li>
          </Link>
          <li
            className="w-full cursor-pointer pl-8 text-sm text-gray-700 hover:bg-slate-300"
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
