import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import BlogAdminPanel from "~/components/blog/BlogAdminPanel";
import FilteredBlogsByTag from "~/components/blog/FilteredBlogsByTag";
import { api } from "~/utils/api";

function Blog() {
  const blogPostsQuery = api.blog.getBlogPosts.useQuery();
  const blogTagsQuery = api.blog.getBlogTags.useQuery();
  const router = useRouter();
  const { tag } = router.query;
  const selectedTagNavigation = (tag: string) => {
    router
      .push(`/hi-pass?tag=${tag}`, undefined, { shallow: true })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex w-full max-w-3xl justify-center gap-8 lg:max-w-5xl">
      <div>
        <h2>Hi-Pass Blog</h2>
        {blogTagsQuery.data &&
          blogTagsQuery.data.map((tag) => (
            <div key={tag.id} onClick={() => selectedTagNavigation(tag.name)}>
              <h5 className="font-bold hover:text-opacity-80">{tag.name}</h5>
            </div>
          ))}
      </div>

      <div className="w-full">
        <BlogAdminPanel />
        <div>
          <h1>Blog Posts</h1>
          {tag ? (
            <FilteredBlogsByTag />
          ) : (
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
                      src={post.imageUrl as string}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;
