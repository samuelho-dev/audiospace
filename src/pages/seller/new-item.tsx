import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { readFileasBase64 } from "~/utils/readFileAsBase64";
import { StandardB2Dropzone } from "~/components/inputs/StandardB2Dropzone";
import RichTextEditor from "~/components/text-editor/RichTextEditor";
import useCustomEditor from "~/components/text-editor/useCustomEditor";
import DOMPurify from "isomorphic-dompurify";
import { TRPCClientError } from "@trpc/client";
import InputImages from "~/components/inputs/InputImages";

function NewItem() {
  const router = useRouter();
  const { data: session } = useSession();
  const editor = useCustomEditor();
  const [errorState, setErrorState] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [previewTrackPresignUrl, setPreviewTrackPresignUrl] = useState<
    string | null
  >(null);
  const [productPresignUrl, setProductDownload] = useState<string | null>(null);
  const [previewTrackFile, setPreviewTrackFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    images: [] as null | string[],
    previewTrack: null as null | string,
    product: null as null | string,
    categoryId: categoryId,
    subcategories: [] as number[],
  });

  const uploadImagesMutation = api.cloudinary.uploadImages.useMutation();
  const categories = api.onload.getAllCategories.useQuery();
  const subcategories = api.onload.getSelectedSubcategories.useQuery({
    categoryId,
  });
  const productMutation = api.seller.uploadProduct.useMutation();

  if (!session) {
    return null;
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      price: parseFloat(e.target.value) * 100,
    });
  };

  const handleImageChange = (images: string[] | null) => {
    setForm({ ...form, images });
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
    if (form.name.length < 3) {
      return setErrorState(`Product names must be longer than 3 characters`);
    }
    if (form.price <= 0) {
      return setErrorState(`Price cannot be below 0`);
    }
    if (!form.images || form.images.length < 1) {
      return setErrorState(`You must upload an image`);
    }
    if (form.subcategories.length < 1) {
      return setErrorState(`Please tag your product`);
    }
    if (!previewTrackFile || !previewTrackPresignUrl || !form.previewTrack) {
      return setErrorState(`Please upload a preview track. Please try again.`);
    }
    if (!productPresignUrl || !productFile || !form.product) {
      return setErrorState(`Please upload a product. Please try again.`);
    }
    if (!editor) {
      return setErrorState(
        `An error occured uploading the description. Please try again.`
      );
    }

    try {
      // UPLOAD IMAGES
      const images = await uploadImagesMutation.mutateAsync({
        images: form.images,
        folder: "products",
      });

      // UPLOAD PREVIEW TRACK
      await axios({
        method: "put",
        url: previewTrackPresignUrl,
        data: previewTrackFile,
        headers: {
          "Content-Type": previewTrackFile.type,
        },
      }).catch(() =>
        setErrorState(
          "Error occured uploading the preview track. Please try again."
        )
      );

      // UPLOAD PRODUCT FILE
      await axios({
        method: "put",
        url: productPresignUrl,
        data: productFile,
        headers: {
          "Content-Type": productFile.type,
        },
      }).catch(() =>
        setErrorState("Error occured uploading the product. Please try again.")
      );

      const sanitizedForm = { ...form };
      sanitizedForm.name = DOMPurify.sanitize(sanitizedForm.name);

      await productMutation.mutateAsync({
        ...sanitizedForm,
        product: form.product,
        previewTrack: form.previewTrack,
        images,
        description: DOMPurify.sanitize(editor.getHTML()),
      });
      void router.push(`/seller/${session.user.name}`);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        setErrorState(err.message);
      } else {
        setErrorState("Unknown Error Occurred");
      }
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8 lg:max-w-6xl">
      <dialog
        open={!!errorState}
        className="sticky top-0 w-full rounded-sm bg-zinc-800 opacity-90"
      >
        <h1>Oops!</h1>
        <p className="text-red-400">{errorState}</p>
      </dialog>
      <form
        onSubmit={(e) => void handleAddProduct(e)}
        className="w-full max-w-3xl"
      >
        <h1 className="border-b border-zinc-700 py-4">Add Product</h1>
        <div className="flex w-full flex-col gap-8 py-4">
          {/* PRODUCT NAME */}
          <div className="flex flex-col ">
            <label>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              className="w-2/5 rounded-sm p-1 text-center text-black"
            />
          </div>
          {/* PRODUCT DESCRIPTION */}
          <div className="flex flex-col">
            <label>Description</label>
            {editor && <RichTextEditor editor={editor} />}
          </div>
          {/* PRICE */}
          <div className="flex flex-col">
            <label>Price</label>
            <input
              type="number"
              id="price"
              name="price"
              min={0}
              step={0.01}
              onChange={handlePriceChange}
              className="w-1/5 rounded-sm p-1 text-black"
            />
          </div>
          {/* CATEGORY */}
          <div className="flex flex-col">
            <label>Category</label>
            <select
              className="w-fit bg-zinc-700 p-1"
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
          {/* SUBCATEGORY */}
          <div className="flex flex-col">
            <label>{`Subcategories - Select up to 2`}</label>
            <div
              className={`grid grid-cols-4 gap-4 rounded-sm p-2 outline outline-1 outline-zinc-700`}
            >
              {subcategories.data &&
                subcategories.data.map((subcategory) => (
                  <div key={subcategory.id} className="flex gap-1">
                    <input
                      id="subcategories"
                      type="checkbox"
                      disabled={
                        form.subcategories.length === 2 &&
                        !form.subcategories.includes(subcategory.id)
                      }
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
          {/* IMAGES */}
          <div className="flex h-full flex-col">
            <h5>Image Upload</h5>
            <InputImages
              setImages={handleImageChange}
              setErrorState={setErrorState}
              multiple={true}
            />
          </div>
          {/* PREVIEW TRACK UPLOAD */}
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
          {/* PRODUCT UPLOAD */}
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
          <button className="w-40 justify-end bg-red-400">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default NewItem;
