import React from "react";
import { PrismaClient } from "@prisma/client";
import { encode } from "~/utils/quickHash";
import { type GetStaticProps } from "next";
import { type PostSchema } from "~/types/schema";
import dynamic from "next/dynamic";

interface PostProps {
  postData: PostSchema;
}

const RenderEditor = dynamic(
  () => import("~/components/text-editor/RenderEditor"),
  {
    ssr: false,
  }
);

function Post({ postData }: PostProps) {
  return (
    <div className="flex w-full max-w-3xl flex-grow flex-col gap-8">
      <h2>{postData.title}</h2>
      <RenderEditor content={postData.content} />
    </div>
  );
}

export default Post;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const encodedId = encode(params?.id as string);

  const prisma = new PrismaClient();

  const data = await prisma.post.findUniqueOrThrow({
    where: {
      id: encodedId,
    },
    include: {
      content: {
        select: {
          data: true,
        },
      },
    },
  });

  type Content = {
    data: Buffer;
  };

  const createdAt = JSON.stringify(data.createdAt);
  const content: Content = data.content;
  const contentData = content.data.toString("utf-8");

  await prisma.$disconnect();

  return {
    props: {
      postData: { ...data, createdAt, content: contentData },
    },
  };
};

export async function getStaticPaths() {
  const prisma = new PrismaClient();

  const allPosts = await prisma.post.findMany({
    select: {
      title: true,
      tag: {
        select: {
          name: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  const paths = allPosts.map((post) => ({
    params: {
      tag: post.tag.name.toLowerCase(),
      id: post.title.replace(" ", "-").toLowerCase(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}
