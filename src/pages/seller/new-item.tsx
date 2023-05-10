import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { readFileasBase64 } from "~/utils/readFileAsBase64";

function NewItem() {
  const { data: session, status } = useSession();
  const [categoryId, setCategoryId] = useState<number>(1);
  const categories = api.onload.getAllCategories.useQuery();
  const subcategories = api.onload.getSelectedSubcategories.useQuery({
    categoryId,
  });
  const productMutation = api.admin.uploadProduct.useMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    images: [] as string[],
    previewTrack: "",
    product: "",
    sellerId: session?.user.id,
    categoryId: categoryId,
    subcategories: [] as number[],
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevData) => ({ ...prevData, price: parseInt(e.target.value) }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prevData) => ({ ...prevData, [name]: value }));
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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const files = e.target.files;
    if (files) {
      try {
        if (field === "images") {
          const base64Files: string[] = [];
          for (const file of files) {
            if (file instanceof File) {
              const readFile = await readFileasBase64(file);
              base64Files.push(readFile);
            }
          }
          setForm((prevData) => ({ ...prevData, [field]: base64Files }));
        } else {
          const file = files[0];
          if (file instanceof File) {
            const base64Files = await readFileasBase64(file);
            setForm((prevData) => ({ ...prevData, [field]: base64Files }));
          }
        }
      } catch (error) {
        console.error("Error reading files:", error);
      }
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productMutation.mutateAsync({ ...form });
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
              onChange={(e) => void handleFileChange(e, "images")}
              className="block w-full cursor-pointer rounded-lg border"
            />
          </div>
          <div className="flex flex-col">
            <label className="">Preview Track</label>
            <input
              type="file"
              id="previewTrack"
              name="previewTrack"
              accept=".mp3, .wav"
              onChange={(e) => void handleFileChange(e, "previewTrack")}
              className="block w-full cursor-pointer rounded-lg border"
            />
          </div>
          <div className="flex flex-col">
            <label className="">Product Download Upload</label>
            <input
              type="file"
              id="product"
              name="product"
              accept=".zip, .rar, .7z"
              onChange={(e) => void handleFileChange(e, "product")}
              className="block w-full cursor-pointer rounded-lg border"
            />
          </div>

          <label className="flex flex-row justify-between">
            Category
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
          </label>
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
