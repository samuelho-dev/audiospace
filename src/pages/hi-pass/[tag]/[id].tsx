import React from "react";
import { PrismaClient } from "@prisma/client";
import { decode, encode } from "~/utils/quickHash";
import { type GetStaticProps } from "next";
import getB2File from "~/utils/getB2File";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Layout from "~/components/mdx/Layout";

function Post({ source, postData }) {
  console.log(postData);
  return (
    <Layout>
      <main>
        <MDXRemote {...source} />
      </main>
    </Layout>
  );
}

export default Post;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const decodedId = encode(params?.id as string);

  // const postData = await api.blog.getPost.useQuery({ id: decodedId });
  const prisma = new PrismaClient();
  const data = await prisma.post.findUniqueOrThrow({
    where: {
      id: decodedId,
    },
  });
  await prisma.$disconnect();
  console.log(data.contentUrl);
  const b2File = await getB2File(data.contentUrl, "AudiospaceBlog");
  const mdxSource = await serialize(b2File);
  console.log(b2File);

  return {
    props: {
      source: mdxSource,
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
    params: { tag: post.tag.name, id: post.title },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}
