import React, { useState } from "react";
import { api } from "~/utils/api";
import { readFileasBase64 } from "~/utils/readFileAsBase64";
import RichTextEditor from "../text-editor/RichTextEditor";
import useCustomEditor from "../text-editor/useCustomEditor";

function BlogAdminPanel() {
  const editor = useCustomEditor();
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    blogTag: 1,
    image: "",
  });

  const blogPostMutation = api.blog.uploadBlogPosts.useMutation();
  const blogTagsQuery = api.blog.getBlogTags.useQuery();
  const createBlobMutation = api.blob.createBlob.useMutation();
  const uploadImagesMutation = api.cloudinary.uploadImages.useMutation();
  const handleNewBlogPost = async () => {
    try {
      if (editor) {
        const post = { ...newPost };

        const images = await uploadImagesMutation.mutateAsync({
          images: [newPost.image],
          folder: "products",
        });
        if (!images[0]) {
          throw new Error("Error uploading images");
        }
        const contentString = JSON.stringify(editor.getJSON());
        const blob = await createBlobMutation.mutateAsync({
          content: contentString,
        });
        post.blogTag = Number(post.blogTag);

        console.log(post);
        await blogPostMutation.mutateAsync({
          ...post,
          contentId: blob.id,
          image: images[0],
        });
      }
    } catch (err) {
      console.error("An error occured", err);
    }
  };

  const blogImageState = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const file = files[0] as File;
      const data = await readFileasBase64(file);
      setNewPost({ ...newPost, image: data });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-zinc-900 p-4">
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
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple={false}
          onChange={(e) => void blogImageState(e)}
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
