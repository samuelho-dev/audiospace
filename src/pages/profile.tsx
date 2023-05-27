import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProfileRoute from "~/components/profile/ProfileRoute";

function getRoute(section: string | string[] | undefined): string {
  return typeof section === "string" ? section : "";
}

function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { section } = router.query;

  const profileNavigation = (section: string) => {
    router
      .push(`/profile?section=${section}`, undefined, { shallow: true })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, session, router]);

  if (status === "authenticated") {
    return (
      <div className="flex h-full w-full max-w-3xl flex-grow justify-between gap-8 py-10 lg:max-w-6xl">
        <div className="h-full w-1/5">
          <h3 className="py-2 font-bold">PROFILE ⬇️</h3>
          <ul className="flex flex-col gap-1">
            <li
              className="text-md cursor-pointer whitespace-nowrap px-2 font-bold text-zinc-100  hover:bg-zinc-800"
              onClick={() => profileNavigation("basic-info")}
            >
              Basic Info
            </li>
            <li
              className="text-md cursor-pointer whitespace-nowrap px-2 font-bold text-zinc-100  hover:bg-zinc-800"
              onClick={() => profileNavigation("wishlist")}
            >
              Wishlist
            </li>
            <li
              className="text-md cursor-pointer whitespace-nowrap px-2 font-bold  text-zinc-100 hover:bg-zinc-800"
              onClick={() => profileNavigation("purchase-history")}
            >
              Purchase History
            </li>
            <li
              className="text-md cursor-pointer whitespace-nowrap px-2 font-bold text-zinc-100  hover:bg-zinc-800"
              onClick={() => profileNavigation("submissions")}
            >
              Past Submissions
            </li>
            <li
              className="text-md cursor-pointer whitespace-nowrap px-2 font-bold text-zinc-100  hover:bg-zinc-800"
              onClick={() => profileNavigation("settings")}
            >
              Settings
            </li>
          </ul>
        </div>
        <div className="w-4/5">
          <ProfileRoute route={getRoute(section)} user={session.user} />
        </div>
      </div>
    );
  }
}

export default Profile;
