import React from "react";
import MarketLayout from "~/layout/MarketLayout";
import { api } from "~/utils/api";

function Kits() {
  const categoryQuery = api.onload.getKitCategories.useQuery();
  if (categoryQuery.data)
    return <MarketLayout categories={categoryQuery.data} />;
}

export default Kits;
