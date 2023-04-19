import React from "react";
import { api } from "~/utils/api";
import MarketLayout from "~/layout/MarketLayout";

function Kits() {
  const categoryQuery = api.onload.getKitCategories.useQuery();
  if (categoryQuery.data)
    return <MarketLayout categories={categoryQuery.data} />;
}

export default Kits;
