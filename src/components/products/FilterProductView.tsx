import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import ProductCard from "./ProductCard";

function FilterProductView() {
  const router = useRouter();
  const { category, tag } = router.query;
  const capitalizeFirstLetters = (str: string) => {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  let checkedTags;
  if (typeof tag === "string") {
    checkedTags = [capitalizeFirstLetters(tag)];
  } else if (Array.isArray(tag)) {
    checkedTags = tag.map((el) => capitalizeFirstLetters(el));
  }

  const productsQuery = api.products.getFilteredProducts.useQuery({
    categories: Array.isArray(category) ? category : [],
    subcategories: checkedTags,
  });

  return (
    <div className="w-full px-2">
      <div className="grid grid-cols-3 items-center justify-center gap-y-8 lg:grid-cols-4">
        {productsQuery?.data &&
          productsQuery.data.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
      </div>
    </div>
  );
}

export default FilterProductView;
