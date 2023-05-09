import { type SessionContextValue, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Submissions from "~/components/profile/submissions";
import PurchaseHistory from "~/components/profile/purchase-history";
import Settings from "~/components/profile/settings";
import BasicInfo from "~/components/profile/basic-info";
import Wishlist from "~/components/profile/wishlist";
import AdminPanel from "~/components/profile/admin-panel";
import MyProducts from "~/components/profile/sellers/my-products";

interface ProfileRouteProps {
  route?: string;
  user: {
    id: string;
    role: string;
    image: string | null;
    email: string;
    name: string;
  };
}

function getRoute(section: string | string[] | undefined): string {
  return typeof section === "string" ? section : "";
}

function ProfileRoute({ route, user }: ProfileRouteProps) {
  switch (route) {
    case "basic-info":
      return <BasicInfo user={user} />;
    case "wishlist":
      return <Wishlist />;
    case "purchase-history":
      return <PurchaseHistory />;
    case "submissions":
      return <Submissions />;
    case "settings":
      return <Settings />;
    case "my-products":
      return <MyProducts />;
    case "admin-panel":
      return <AdminPanel />;

    default:
      return <BasicInfo user={user} />;
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
  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, session, router]);

  if (status === "authenticated") {
    return (
      <div className="flex w-full max-w-3xl items-center justify-between gap-8 lg:max-w-6xl">
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
              {session.user.role === "SELLER" ||
                (session.user.role === "ADMIN" && (
                  <>
                    <h5
                      className="cursor-pointer hover:bg-gray-900"
                      onClick={() => profileNavigation("my-products")}
                    >
                      My Products
                    </h5>
                  </>
                ))}
              {session.user.role === "ADMIN" && (
                <h5
                  className="cursor-pointer bg-zinc-700 hover:bg-gray-900"
                  onClick={() => profileNavigation("admin-panel")}
                >
                  Admin Panel
                </h5>
              )}
            </div>
          </div>
        </div>
        <div className="w-4/5">
          <ProfileRoute route={getRoute(section)} user={session.user} />
        </div>
      </div>
    );
  }
}

export default Profile;
