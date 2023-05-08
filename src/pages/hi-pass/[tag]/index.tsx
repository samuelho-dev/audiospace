import { useRouter } from "next/router";
import React from "react";
import PostPreview from "~/components/blog/PostPreview";
import Sidebar from "~/components/blog/Sidebar";
import { api } from "~/utils/api";

function BlogFilteredByTag() {
  const router = useRouter();
  const { tag } = router.query;
  const filteredBlogPostQuery = api.blog.getFilteredBlogPostsByTag.useQuery(
    {
      tag: tag as string,
    },
    { enabled: !!tag }
  );
  return (
    <div className="flex w-full max-w-3xl justify-center gap-8 lg:max-w-5xl">
      <Sidebar />
      <div className="w-full">
        <h3>{tag}</h3>
        <div>
          {filteredBlogPostQuery.data &&
            filteredBlogPostQuery.data.map((post) => (
              <PostPreview post={post} key={post.id} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default BlogFilteredByTag;
