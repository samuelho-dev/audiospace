import { PrismaClient } from "@prisma/client";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import PostPreview from "~/components/blog/PostPreview";
import { type PostSchema } from "~/types/schema";

interface BlogFilteredByTagProps {
  blogPosts: PostSchema[];
}

function BlogFilteredByTag({ blogPosts }: BlogFilteredByTagProps) {
  const router = useRouter();
  const { tag } = router.query;

  return (
    <div className="flex w-full max-w-3xl flex-grow justify-center gap-8 lg:max-w-6xl">
      <Link href={"/hi-pass"}>Back</Link>
      <div className="w-full">
        <h3>{tag?.toString().toUpperCase()}</h3>
        <div>
          {blogPosts.map((post) => (
            <PostPreview post={post} key={post.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogFilteredByTag;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const tag = params?.tag as string;
  const prisma = new PrismaClient();
  const data = await prisma.post.findMany({
    where: {
      tag: {
        name: tag,
      },
    },
    select: {
      id: true,
      title: true,
      author: true,
      description: true,
      createdAt: true,
      image: true,
      tag: true,
    },
  });
  await prisma.$disconnect();

  const mutatePosts = data.map((post) => {
    return { ...post, createdAt: JSON.stringify(post.createdAt) };
  });

  return {
    props: {
      blogPosts: mutatePosts,
    },
  };
};
