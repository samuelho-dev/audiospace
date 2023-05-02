import { getAllPostIds, getPostData } from "lib/posts";
import { remark } from "remark";
import html from "remark-html";
import React from "react";
import Layout from "~/layout/Layout";
import Head from "next/head";
import { parseISO, format } from "date-fns";
import { api } from "~/utils/api";
import { PrismaClient } from "@prisma/client";
import { decode, encode } from "~/utils/quickHash";
import { z } from "zod";
import { type GetStaticProps } from "next";
import getB2File from "~/utils/getB2File";
import matter from "gray-matter";

function Post({ postData }) {
  console.log(postData);
  return (
    <div>
      <h1>Post {postData.id}</h1>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
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
  const postData = { ...data };
  postData.createdAt = JSON.stringify(postData.createdAt);
  const b2File = await getB2File(data.contentUrl, "AudiospaceBlog");
  const matterResult = matter(b2File);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  console.log({ contentHtml, ...postData });
  return {
    props: {
      contentHtml,
      ...postData,
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
