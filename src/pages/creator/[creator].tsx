import { useRouter } from "next/router";
import React from "react";

function CategoryPage() {
  const router = useRouter();
  const { creator } = router.query;

  if (router.isFallback) {
    return <div>Loading</div>;
  }

  return <div>{creator}</div>;
}

export default CategoryPage;
