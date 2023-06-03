import React, { useState } from "react";
import BlogAdminPanel from "~/components/blog/BlogAdminPanel";
import PostPreview from "~/components/blog/PostPreview";
import Sidebar from "~/components/blog/Sidebar";
import { api } from "~/utils/api";

function Blog() {
  const blogPostsQuery = api.blog.getBlogPosts.useQuery(undefined, {
    cacheTime: Infinity,
  });
  const [adminPanelActive, setAdminPanelActive] = useState(false);

  return (
    <div className="flex w-full max-w-3xl flex-grow justify-center gap-8 py-10 lg:max-w-6xl">
      <Sidebar
        adminPanelActive={adminPanelActive}
        setAdminPanelActive={setAdminPanelActive}
      />
      <div className="w-full">
        {adminPanelActive && <BlogAdminPanel />}
        <div>
          <h1>Blog Posts</h1>
          <div className="flex flex-col gap-2">
            {blogPostsQuery.data &&
              blogPostsQuery.data.map((post) => (
                <PostPreview post={post} key={post.id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
