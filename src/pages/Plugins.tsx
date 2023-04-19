import React from "react";
import { api } from "~/utils/api";
import MarketLayout from "~/layout/MarketLayout";

function Plugins() {
  const categoryQuery = api.onload.getPluginCategories.useQuery();
  if (categoryQuery.data)
    return <MarketLayout categories={categoryQuery.data} />;
}

export default Plugins;
