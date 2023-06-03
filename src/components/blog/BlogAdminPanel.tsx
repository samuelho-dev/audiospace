import React, { useState } from "react";
import { api } from "~/utils/api";
import InputImages from "../inputs/InputImages";
import ErrorDialog from "../error/ErrorDialog";
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import("../text-editor/RichTextEditor"), {
  ssr: false,
});

function BlogAdminPanel() {
  const [errorState, setErrorState] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    content: null as string | null,
    blogTag: 1,
    image: null as string[] | null,
  });

  const blogPostMutation = api.blog.uploadBlogPosts.useMutation();
  const blogTagsQuery = api.blog.getBlogTags.useQuery();
  const uploadImagesMutation = api.cloudinary.uploadImages.useMutation();

  const handleEditorUpdate = (content: string) => {
    setNewPost({ ...newPost, content });
  };

  const handleNewBlogPost = async () => {
    if (newPost.title.length <= 0) {
      return setErrorState("Missing Title");
    }
    if (!newPost.content) {
      return setErrorState("Content does not exist");
    }
    if (!newPost.image || !newPost.image[0]) {
      return setErrorState("Image not found");
    }

    try {
      const post = { ...newPost };

      const images = await uploadImagesMutation.mutateAsync({
        images: newPost.image,
        folder: "products",
      });

      if (!images[0]) {
        throw new Error("Error uploading images");
      }

      post.blogTag = Number(post.blogTag);

      await blogPostMutation.mutateAsync({
        ...post,
        content: newPost.content,
        image: images[0],
      });
    } catch (err) {
      console.error(err);
      setErrorState(`An error occured during upload`);
    }
  };

  const handleImageChange = (image: string[] | null) => {
    setNewPost({ ...newPost, image });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-zinc-900 p-4">
      <ErrorDialog errorState={errorState} />
      {/* TITLE */}
      <div className="flex w-full flex-col">
        <label>Title</label>
        <input
          className="text-black"
          name="title"
          type="text"
          onChange={handleChange}
        />
      </div>
      {/* DESCRIPTION */}
      <div className="flex w-full flex-col">
        <label>Description</label>
        <input
          className="text-black"
          type="text"
          name="description"
          onChange={handleChange}
        />
      </div>
      {/* IMAGE */}
      <div className="flex flex-col">
        <label>Image</label>
        <InputImages
          multiple={false}
          setErrorState={setErrorState}
          setImages={handleImageChange}
        />
      </div>
      {/* CONTENT */}
      <TextEditor editable={true} handleUpdate={handleEditorUpdate} />
      {/* BLOG TYPE */}
      <div className="flex flex-col">
        <label>Blog Type</label>
        <select
          name="blogTag"
          className="w-fit text-black"
          onChange={handleChange}
        >
          {blogTagsQuery.data &&
            blogTagsQuery.data.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
        </select>
      </div>
      <button
        className="my-2 w-fit border border-zinc-300 bg-zinc-600 px-2"
        onClick={() => void handleNewBlogPost()}
      >
        SUBMIT
      </button>
    </div>
  );
}

export default BlogAdminPanel;
