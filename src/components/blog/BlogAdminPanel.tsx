import React, { useState } from "react";
import { api } from "~/utils/api";
import { readFileasBase64 } from "~/utils/readFileAsBase64";
import RichTextEditor from "../text-editor/RichTextEditor";
import useCustomEditor from "../text-editor/useCustomEditor";
import DOMPurify from "dompurify";
import InputImages from "../inputs/InputImages";
import { useSession } from "next-auth/react";
import ErrorDialog from "../error/ErrorDialog";

function BlogAdminPanel() {
  const editor = useCustomEditor();
  const { data: session } = useSession();
  const [errorState, setErrorState] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    blogTag: 1,
    image: null as string[] | null,
  });

  const blogPostMutation = api.blog.uploadBlogPosts.useMutation();
  const blogTagsQuery = api.blog.getBlogTags.useQuery();
  const uploadImagesMutation = api.cloudinary.uploadImages.useMutation();
  const handleNewBlogPost = async () => {
    if (session?.user.role !== "ADMIN") {
      return setErrorState("Unauthorized Use");
    }
    if (newPost.title.length <= 0) {
      return setErrorState("Missing Title");
    }
    if (!newPost.image || !newPost.image[0]) {
      return setErrorState("Image not found");
    }
    if (!editor) {
      return setErrorState("Editor does not exist");
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
        content: DOMPurify.sanitize(editor.getHTML()),
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
    <div className="flex flex-col gap-2 rounded-lg bg-zinc-900 p-4">
      <ErrorDialog errorState={errorState} />
      <div className="flex w-full flex-col">
        <label>Title</label>
        <input
          className="text-black"
          name="title"
          type="text"
          onChange={handleChange}
        />
      </div>
      <div className="flex w-full flex-col">
        <label>Description</label>
        <input
          className="text-black"
          type="text"
          name="description"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label>Image</label>
        <InputImages
          multiple={false}
          setErrorState={setErrorState}
          setImages={handleImageChange}
        />
      </div>

      {editor && <RichTextEditor editor={editor} />}

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
        className="my-2 border border-zinc-300 bg-zinc-600 px-2"
        onClick={() => void handleNewBlogPost()}
      >
        SUBMIT
      </button>
    </div>
  );
}

export default BlogAdminPanel;
