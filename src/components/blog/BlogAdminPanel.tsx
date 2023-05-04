import React, { useState } from "react";
import { api } from "~/utils/api";
import { StandardB2Dropzone } from "../dropzone/StandardB2Dropzone";

function BlogAdminPanel() {
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    blogTag: 1,
    file: "",
  });

  const [uploadedFile, setUploadedFile] = useState(false);
  const blogPostMutation = api.blog.uploadBlogPosts.useMutation();
  const blogTagsQuery = api.blog.getBlogTags.useQuery();

  const handleNewBlogPost = async () => {
    const post = { ...newPost };
    post.blogTag = Number(post.blogTag);
    await blogPostMutation.mutateAsync(post);
  };

  const handleFileChange = (value: string) => {
    setNewPost((prevData) => ({ ...prevData, file: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // console.log(newPost);
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

        {uploadedFile ? (
          <h3>Submitted</h3>
        ) : (
          <StandardB2Dropzone
            bucket="AudiospaceBlog"
            handleFileChange={handleFileChange}
            setUploadedFile={setUploadedFile}
          />
        )}
        <div className="flex flex-col gap-2">
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
          className="my-2 border border-zinc-300 px-2"
          onClick={() => void handleNewBlogPost()}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}

export default BlogAdminPanel;
