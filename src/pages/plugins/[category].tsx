import { useRouter } from "next/router";
import React from "react";

function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  if (router.isFallback) {
    return <div>Loading</div>;
  }

  return <div>{category}</div>;
}

export default CategoryPage;

// export async function getStaticProps({ params }) {
//   const { category } = params;
//   const products = await api.getProductsBySubcategoryName(subcategory);

//   return {
//     props: {
//       products,
//     },
//     revalidate: 60,
//   };
// }
