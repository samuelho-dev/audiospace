import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { readFileasBase64 } from "~/utils/readFileAsBase64";

function AdminPanel() {
  const { data: session, status } = useSession();
  const [categoryId, setCategoryId] = useState<number>(1);

  const [sellerCreationActive, setSellerCreationActive] = useState(false);
  const [newSellerName, setNewSellerName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session?.user.role !== "ADMIN" || status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, session, router]);

  const categories = api.onload.getAllCategories.useQuery();
  const subcategories = api.onload.getSelectedSubcategories.useQuery({
    categoryId,
  });
  const sellers = api.onload.getAllSellers.useQuery();
  // const sellerMutation = api.admin.createSeller.useMutation();
  const productMutation = api.sellerprofile.uploadProduct.useMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    images: [] as string[],
    previewTrack: "",
    product: "",
    sellerId: 1,
    categoryId: categoryId,
    subcategories: [] as number[],
  });

  const handleSellerCreationToggle = () => {
    setSellerCreationActive(!sellerCreationActive);
  };
  const handleSellerCreation = async () => {
    // try {
    //   await sellerMutation
    //     .mutateAsync({
    //       name: newSellerName,
    //     })
    //     .then(() => router.reload());
    // } catch (err) {
    //   console.error("Seller creation error:", err);
    // }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevData) => ({ ...prevData, price: parseInt(e.target.value) }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    await productMutation.mutateAsync({ ...form });
    // try {
    // } catch (err) {
    //   console.error("Error adding product:", err);
    // }
  };

  return (
    <div className="w-full">
      <form onSubmit={(e) => void handleAddProduct(e)}>
        <h3>Add Product</h3>
        <div className="flex flex-col gap-4">
          <label className="flex flex-row justify-between gap-10">
            Name
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              className="rounded-lg text-center text-black"
            />
          </label>

          <label className="flex flex-row justify-between gap-10">
            Description
            <input
              type="text"
              id="description"
              name="description"
              onChange={handleChange}
              className="rounded-lg text-center text-black"
            />
          </label>
          <label className="flex flex-row justify-between gap-10">
            Price
            <input
              type="number"
              id="price"
              name="price"
              onChange={handlePriceChange}
              className="rounded-lg text-center text-black"
            />
          </label>

          <div className="flex flex-col">
            <label className="flex flex-row justify-between gap-10">
              Images Upload
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              onChange={(e) => void handleFileChange(e, "images")}
              className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="flex flex-row justify-between gap-10">
              Preview Track
            </label>
            <input
              type="file"
              id="previewTrack"
              name="previewTrack"
              accept=".mp3, .wav"
              onChange={(e) => void handleFileChange(e, "previewTrack")}
              className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="flex flex-row justify-between gap-10">
              Product Download Upload
            </label>
            <input
              type="file"
              id="product"
              name="product"
              accept=".zip, .rar, .7z"
              onChange={(e) => void handleFileChange(e, "product")}
              className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="sellerId"
              className="flex flex-row justify-between gap-10"
            >
              Sellers
            </label>
            <div className="flex justify-between gap-4">
              <div
                onClick={handleSellerCreationToggle}
                className="cursor-pointer whitespace-nowrap rounded-lg px-2 outline outline-1 outline-zinc-600 hover:bg-zinc-500"
              >
                {sellerCreationActive ? "Select Seller" : "Create Seller"}
              </div>
              {sellerCreationActive ? (
                <div className="flex gap-4">
                  <div
                    onClick={() => void handleSellerCreation()}
                    className="cursor-pointer whitespace-nowrap rounded-lg bg-red-300 px-2 outline outline-1 outline-zinc-600 hover:bg-zinc-500"
                  >
                    Create
                  </div>
                  <input
                    type="text"
                    className="text-black"
                    value={newSellerName}
                    onChange={(e) => setNewSellerName(e.target.value)}
                  />
                </div>
              ) : (
                <select
                  className="bg-zinc-700 px-2"
                  id="sellerId"
                  name="sellerId"
                  onChange={handleChange}
                >
                  {sellers.data &&
                    sellers.data.map((seller) => (
                      <option key={seller.id} value={Number(seller.id)}>
                        {seller.user.username}
                      </option>
                    ))}
                </select>
              )}
            </div>
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
          <label className="flex flex-col justify-between">
            Subcategories
            <div className="flex flex-wrap gap-4 rounded-lg p-2 outline outline-1 outline-zinc-700">
              {subcategories.data &&
                subcategories.data.map((subcategory) => (
                  <div key={subcategory.id} className="flex gap-1">
                    <label
                      htmlFor="subcategories"
                      className="whitespace-nowrap"
                    >
                      {subcategory.name}
                    </label>
                    <input
                      id="subcategories"
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      value={subcategory.id}
                    />
                  </div>
                ))}
            </div>
          </label>
          <button className="bg-red-400">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default AdminPanel;
