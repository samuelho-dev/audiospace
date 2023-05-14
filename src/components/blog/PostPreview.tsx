import Image from "next/image";
import Link from "next/link";
import React from "react";
import { type PostSchema } from "~/types/schema";

interface PostPreviewProps {
  post: PostSchema;
}

function PostPreview({ post }: PostPreviewProps) {
  return (
    <div>
      <Link
        href={`/hi-pass/${post.tag.name.toLowerCase()}/${post.title
          .replace(" ", "-")
          .toLowerCase()}`}
        passHref={true}
        className="flex border border-zinc-800 p-4 hover:rounded-lg hover:bg-zinc-900"
      >
        <Image
          src={post.image}
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
    </div>
  );
}

export default PostPreview;
