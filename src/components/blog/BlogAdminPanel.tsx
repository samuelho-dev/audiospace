import React, { useState } from "react";
import { api } from "~/utils/api";
import { readFileasBase64 } from "~/utils/readFileAsBase64";

function BlogAdminPanel() {
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    blogTag: 1,
    file: "",
  });
  const blogPostMutation = api.blog.uploadBlogPosts.useMutation();
  const blogTagsQuery = api.blog.getBlogTags.useQuery();
  const handleNewBlogPost = async () => {
    const post = { ...newPost };
    post.blogTag = Number(post.blogTag);

    console.log(typeof post.blogTag);
    await blogPostMutation.mutateAsync(post);
  };
  console.log(newPost);
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const files = e.target.files;
    if (files) {
      try {
        const file = files[0];
        if (file instanceof File) {
          const base64Files = await readFileasBase64(file);
          setNewPost((prevData) => ({ ...prevData, [field]: base64Files }));
        }
      } catch (error) {
        console.error("Error reading files:", error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPost((prevData) => ({ ...prevData, [name]: value }));
  };
  return (
    <div>
      <div>
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
        <input
          onChange={(e) => void handleFileChange(e, "file")}
          type="file"
          accept=".md"
          multiple={false}
        />
        <select name="blogTag" className="text-black" onChange={handleChange}>
          {blogTagsQuery.data &&
            blogTagsQuery.data.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
        </select>
        <button onClick={() => void handleNewBlogPost()}>SUBMIT</button>
      </div>
    </div>
  );
}

export default BlogAdminPanel;
