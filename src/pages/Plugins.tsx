import React from "react";
import MarketLayout from "~/layout/MarketLayout";
import { api } from "~/utils/api";

function Plugins() {
  const categoryQuery = api.onload.getPluginCategories.useQuery();
  if (categoryQuery.data)
    return <MarketLayout categories={categoryQuery.data} />;
}

export default Plugins;
