import React from "react";
import { PrismaClient } from "@prisma/client";
import { encode } from "~/utils/quickHash";
import { type GetStaticProps } from "next";
import getB2File from "~/utils/getB2File";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Layout from "~/components/mdx/Layout";
import { parse, stringify } from "superjson";

interface PostProps {
  source: MDXRemoteProps;
  postData: string;
}
function Post({ source, postData }: PostProps) {
  const data = parse(postData);
  console.log(data);
  if (!data || !source) {
    return null;
  }
  return (
    <Layout>
      <main className="flex h-full w-full max-w-2xl flex-col">
        <MDXRemote {...source} />
      </main>
    </Layout>
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
  });
  await prisma.$disconnect();

  const b2File = await getB2File(data.contentUrl, "AudiospaceBlog");
  const mdxSource = await serialize(b2File);

  return {
    props: {
      source: mdxSource,
      postData: stringify(data),
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
