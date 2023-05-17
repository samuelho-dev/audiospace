import React from "react";
import BasicInfo from "./basic-info";
import Wishlist from "./wishlist";
import PurchaseHistory from "./purchase-history";
import Submissions from "./submissions";
import Settings from "./settings";
import Payments from "./payments";

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
    case "payments":
      return <Payments />;

    default:
      return <BasicInfo user={user} />;
  }
}
export default ProfileRoute;
