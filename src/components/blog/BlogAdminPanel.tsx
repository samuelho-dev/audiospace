import React, { useState } from "react";
import { api } from "~/utils/api";
import { StandardB2Dropzone } from "../dropzone/StandardB2Dropzone";
import { readFileasBase64 } from "~/utils/readFileAsBase64";
import axios from "axios";

function BlogAdminPanel() {
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    blogTag: 1,
    imageUrl: "",
    file: "",
  });
  const [presignUrl, setPresignedUrl] = useState<string | null>(null);
  const [markdownFile, setMarkdownFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState(false);
  const blogPostMutation = api.blog.uploadBlogPosts.useMutation();
  const blogTagsQuery = api.blog.getBlogTags.useQuery();
  const uploadCloudinaryMutation = api.cloudinary.uploadImages.useMutation();

  const handleNewBlogPost = async () => {
    try {
      if (presignUrl && markdownFile) {
        const post = { ...newPost };
        post.blogTag = Number(post.blogTag);
        await axios({
          method: "put",
          url: presignUrl,
          data: markdownFile,
          headers: {
            "Content-Type": markdownFile.type,
          },
        });
        await blogPostMutation.mutateAsync(post);
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

  const handleFileChange = (value: string, field: string) => {
    setNewPost((prevData) => ({ ...prevData, [field]: value }));
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
            accept="image/png, image/jpeg, image/jpg"
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

      <StandardB2Dropzone
        bucket="AudiospaceBlog"
        field={"file"}
        handleFileChange={handleFileChange}
        setPresignedUrl={setPresignedUrl}
        setProductDownloadFile={setMarkdownFile}
      />

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
