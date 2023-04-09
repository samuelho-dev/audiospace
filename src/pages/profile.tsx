import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Submissions from "~/components/profile/submissions";
import PurchaseHistory from "~/components/profile/purchase-history";
import Settings from "~/components/profile/settings";
import BasicInfo from "~/components/profile/basic-info";
import Wishlist from "~/components/profile/wishlist";

interface ProfileRouteProps {
  route?: string;
  session: Session;
}

function getRoute(section: string | string[] | undefined): string {
  return typeof section === "string" ? section : "";
}

function ProfileRoute({ route, session }: ProfileRouteProps) {
  console.log(route, "route");
  switch (route) {
    case "basic-info":
      return <BasicInfo session={session} />;
    case "wishlist":
      return <Wishlist />;
    case "purchase-history":
      return <PurchaseHistory />;
    case "submissions":
      return <Submissions />;
    case "settings":
      return <Settings />;

    default:
      return <BasicInfo session={session} />;
  }
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

  if (status === "unauthenticated") {
    void router.push("/auth/signin");
  }

  if (status === "authenticated") {
    return (
      <div className="flex h-80 w-full max-w-2xl items-center justify-between lg:max-w-3xl">
        <div className="h-full w-1/5">
          <div>
            <h3>PROFILE ⬇️</h3>
            <div className="flex flex-col pl-4">
              <h5
                className="cursor-pointer hover:bg-gray-900"
                onClick={() => profileNavigation("basic-info")}
              >
                Basic Info
              </h5>
              <h5
                className="cursor-pointer hover:bg-gray-900"
                onClick={() => profileNavigation("wishlist")}
              >
                Wishlist
              </h5>
              <h5
                className="cursor-pointer hover:bg-gray-900"
                onClick={() => profileNavigation("purchase-history")}
              >
                Purchase History
              </h5>
              <h5
                className="cursor-pointer hover:bg-gray-900"
                onClick={() => profileNavigation("submissions")}
              >
                Past Submissions
              </h5>
              <h5
                className="cursor-pointer hover:bg-gray-900"
                onClick={() => profileNavigation("settings")}
              >
                Settings
              </h5>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <ProfileRoute route={getRoute(section)} session={session} />
        </div>
      </div>
    );
  }
}

export default Profile;
