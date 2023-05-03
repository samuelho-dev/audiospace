import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import BlogAdminPanel from "~/components/blog/BlogAdminPanel";
import { api } from "~/utils/api";

function Blog() {
  const blogPostsQuery = api.blog.getBlogPosts.useQuery();
  const blogTagsQuery = api.blog.getBlogTags.useQuery();
  return (
    <div className="flex w-full max-w-3xl justify-center gap-8 lg:max-w-5xl">
      <div>
        <h2>Hi-Pass Blog</h2>
        {blogTagsQuery.data &&
          blogTagsQuery.data.map((tag) => (
            <h5 className="font-bold" key={tag.id}>
              {tag.name}
            </h5>
          ))}
      </div>

      <div className="w-full">
        <BlogAdminPanel />
        <div>
          <h1>Blog Posts</h1>
          <div>
            {blogPostsQuery.data &&
              blogPostsQuery.data.map((post) => (
                <Link
                  key={post.id}
                  href={`/hi-pass/${post.tag.name.toLowerCase()}/${post.title
                    .replace(" ", "-")
                    .toLowerCase()}`}
                  passHref={true}
                  className="flex border border-zinc-800 p-4 hover:rounded-lg hover:bg-zinc-900"
                >
                  <Image
                    src="https://res.cloudinary.com/ddhal4lbv/image/upload/v1680578842/audiospace/RC-20-Retro-Color-UI-Alpha_ue0qpp.png"
                    className="rounded-lg object-scale-down"
                    alt="productimg"
                    width={100}
                    height={100}
                    loading="lazy"
                  />
                  <div className="flex w-full justify-between p-4">
                    <div>
                      <h3>{post.title}</h3>
                      <p className="text-xs font-bold">{post.tag.name}</p>

                      <p>by {post.author}</p>
                      <p>{post.description}</p>
                    </div>

                    <p>DATE</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
