import { PrismaClient } from "@prisma/client";
import { type GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import PostPreview from "~/components/blog/PostPreview";
import Sidebar from "~/components/blog/Sidebar";
import { type PostSchema } from "~/types/schema";

const AdminPanel = dynamic(() => import("~/components/blog/BlogAdminPanel"), {
  ssr: false,
});

interface BlogProps {
  blogPosts: PostSchema[];
}

function Blog({ blogPosts }: BlogProps) {
  const [adminPanelActive, setAdminPanelActive] = useState(false);

  return (
    <div className="flex w-full max-w-3xl flex-grow justify-center gap-8 py-10 lg:max-w-6xl">
      <Sidebar
        adminPanelActive={adminPanelActive}
        setAdminPanelActive={setAdminPanelActive}
      />
      <div className="w-full">
        {adminPanelActive && <AdminPanel />}
        <div>
          <h1>Blog Posts</h1>
          <div className="flex flex-col gap-2">
            {blogPosts.map((post) => (
              <PostPreview post={post} key={post.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const prisma = new PrismaClient();
  const data = await prisma.post.findMany({
    where: {},
    select: {
      id: true,
      author: true,
      image: true,
      description: true,
      tag: true,
      createdAt: true,
    },
    take: 20,
  });

  return {
    props: {
      blogPosts: data,
    },
  };
};
