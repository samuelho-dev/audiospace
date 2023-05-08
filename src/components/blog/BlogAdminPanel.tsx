import React, { useState } from "react";
import { api } from "~/utils/api";
import { StandardB2Dropzone } from "../dropzone/StandardB2Dropzone";
import { readFileasBase64 } from "~/utils/readFileAsBase64";

function BlogAdminPanel() {
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    blogTag: 1,
    imageUrl: "",
    file: "",
  });
  const [uploadedFile, setUploadedFile] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(false);
  const blogPostMutation = api.blog.uploadBlogPosts.useMutation();
  const blogTagsQuery = api.blog.getBlogTags.useQuery();
  const uploadCloudinaryMutation = api.cloudinary.uploadImages.useMutation();

  const handleNewBlogPost = async () => {
    const post = { ...newPost };
    post.blogTag = Number(post.blogTag);
    await blogPostMutation.mutateAsync(post);
  };

  const blogImageState = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const file = files[0] as File;
      const data = await readFileasBase64(file);
      setNewPost((prevData) => ({ ...prevData, imageUrl: data }));
    }
  };

  const blogImageUpload = async () => {
    const data = await uploadCloudinaryMutation.mutateAsync({
      folder: "blog",
      images: [newPost.imageUrl],
    });
    setNewPost((prevData) => ({
      ...prevData,
      imageUrl: data[0]?.imageUrl as string,
    }));
    setUploadedImage(true);
  };

  const handleFileChange = (value: string) => {
    setNewPost((prevData) => ({ ...prevData, file: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPost((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="rounded-lg bg-zinc-900 p-4">
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
      {uploadedImage ? (
        <h3>Submitted</h3>
      ) : (
        <div className="my-2 flex">
          <input
            type="file"
            accept="/png, /jpeg,"
            multiple={false}
            onChange={(e) => void blogImageState(e)}
          />
          <button
            className="border border-zinc-200 px-2"
            onClick={() => void blogImageUpload()}
          >
            Submit Image
          </button>
        </div>
      )}
      {uploadedFile ? (
        <h3>Submitted</h3>
      ) : (
        <StandardB2Dropzone
          bucket="AudiospaceBlog"
          handleFileChange={handleFileChange}
          setUploadedFile={setUploadedFile}
        />
      )}
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
