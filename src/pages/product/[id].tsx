import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

function CategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  console.log(typeof router.query.id);
  if (router.isFallback || !id) {
    return <div>Loading</div>;
  }
  const productInfoQuery = api.products.getProductInfo.useQuery({
    id,
  });

  return <div></div>;
}

export default CategoryPage;
