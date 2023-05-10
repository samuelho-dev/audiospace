import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { readFileasBase64 } from "~/utils/readFileAsBase64";
import { StandardB2Dropzone } from "~/components/dropzone/StandardB2Dropzone";

function NewItem() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<number>(1);
  const [previewTrackPresignUrl, setPreviewTrackPresignUrl] = useState<
    string | null
  >(null);
  const [productPresignUrl, setProductDownload] = useState<string | null>(null);
  const [previewTrackFile, setPreviewTrackFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    images: [] as string[],
    previewTrack: "",
    product: "",
    categoryId: categoryId,
    subcategories: [] as number[],
  });

  const uploadImagesMutation = api.cloudinary.uploadImages.useMutation();
  const categories = api.onload.getAllCategories.useQuery();
  const subcategories = api.onload.getSelectedSubcategories.useQuery({
    categoryId,
  });
  const productMutation = api.sellerprofile.uploadProduct.useMutation();

  if (!session) {
    return null;
  }
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      price: parseInt(e.target.value) * 100,
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      const filesBase64 = await Promise.all(
        filesArray.map((file) => readFileasBase64(file))
      );
      setForm({ ...form, images: filesBase64 });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const subcategoryId = parseInt(value);

    setForm((prevData) => {
      const prevSubcategories = prevData.subcategories;
      const newSubcategories = checked
        ? [...prevSubcategories, subcategoryId]
        : prevSubcategories.filter((id) => id !== subcategoryId);
      return { ...prevData, subcategories: newSubcategories };
    });
  };

  const handleFileChange = (value: string, field: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        previewTrackFile &&
        previewTrackPresignUrl &&
        productPresignUrl &&
        productFile &&
        session.user.role === "ADMIN"
      ) {
        await uploadImagesMutation
          .mutateAsync({
            images: form.images,
            folder: "products",
          })
          .then((data) => setForm({ ...form, images: data }));

        await axios({
          method: "put",
          url: previewTrackPresignUrl,
          data: previewTrackFile,
          headers: {
            "Content-Type": previewTrackFile.type,
          },
        });
        await axios({
          method: "put",
          url: productPresignUrl,
          data: productFile,
          headers: {
            "Content-Type": productFile.type,
          },
        });

        await productMutation.mutateAsync({ ...form });
        void router.push(`/seller/${session.user.name}`);
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8 lg:max-w-6xl">
      <form onSubmit={(e) => void handleAddProduct(e)}>
        <h3>Add Product</h3>
        <div className="flex w-full max-w-3xl flex-col gap-4">
          <div className="flex flex-row justify-between ">
            <label>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              className="rounded-lg text-center text-black"
            />
          </div>
          <div className="flex flex-col justify-between gap-2">
            <label>Description</label>
            <textarea
              id="freeform"
              rows={4}
              cols={50}
              name="description"
              onChange={handleChange}
              className="rounded-lg p-4 text-black"
            />
          </div>
          <div className="flex flex-row justify-between ">
            <label>Price</label>
            <input
              type="number"
              id="price"
              name="price"
              onChange={handlePriceChange}
              className="rounded-lg text-center text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="">Images Upload</label>
            <input
              id="images"
              type="file"
              name="images"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              onChange={(e) => void handleImageChange(e)}
              className="block w-full cursor-pointer rounded-lg border"
            />
          </div>
          <div>
            <label>Preview Track</label>
            <StandardB2Dropzone
              bucket={"AudiospaceProducts"}
              field={"previewTrack"}
              handleFileChange={handleFileChange}
              setPresignedUrl={setPreviewTrackPresignUrl}
              setProductDownloadFile={setPreviewTrackFile}
            />
          </div>
          <div>
            <label>Product</label>
            <StandardB2Dropzone
              bucket={"AudiospaceProducts"}
              field={"product"}
              handleFileChange={handleFileChange}
              setPresignedUrl={setProductDownload}
              setProductDownloadFile={setProductFile}
            />
          </div>

          <div className="flex flex-row justify-between">
            <label>Category</label>
            <select
              className="bg-zinc-700 px-2"
              onChange={(e) => setCategoryId(parseInt(e.target.value))}
            >
              {categories.data &&
                categories.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col justify-between gap-2">
            <label>Subcategories</label>
            <div className="grid grid-cols-4 gap-4 rounded-lg p-2 outline outline-1 outline-zinc-700">
              {subcategories.data &&
                subcategories.data.map((subcategory) => (
                  <div key={subcategory.id} className="flex gap-1">
                    <input
                      id="subcategories"
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      value={subcategory.id}
                    />
                    <label
                      htmlFor="subcategories"
                      className={`whitespace-nowrap ${
                        form.subcategories.includes(subcategory.id)
                          ? "underline underline-offset-8"
                          : ""
                      }`}
                    >
                      {subcategory.name}
                    </label>
                  </div>
                ))}
            </div>
          </div>
          <button className="w-40 justify-end bg-red-400">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default NewItem;
