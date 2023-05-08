import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

function FilteredBlogsByTag() {
  const router = useRouter();
  const { tag } = router.query;
  console.log(tag);
  // const filteredBlogPostQuery = api.blog.getFilteredBlogPostsByTag.useQuery({
  //   tag,
  // });
  return <div>FilteredBlogsByTag</div>;
}

export default FilteredBlogsByTag;
