import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BlogAdminPanel from "~/components/blog/BlogAdminPanel";
import PostPreview from "~/components/blog/PostPreview";
import Sidebar from "~/components/blog/Sidebar";
import { api } from "~/utils/api";

function Blog() {
  const session = useSession();
  const blogPostsQuery = api.blog.getBlogPosts.useQuery();

  return (
    <div className="flex w-full max-w-3xl justify-center gap-8 lg:max-w-6xl">
      <Sidebar />
      <div className="w-full">
        {session.data?.user.role === "ADMIN" && <BlogAdminPanel />}
        <div>
          <h1>Blog Posts</h1>
          <div>
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
