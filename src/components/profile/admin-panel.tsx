import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api";

function AdminPanel() {
  const { data: session, status } = useSession();
  const [categoryId, setCategoryId] = useState<number>(1);
  const [sellerCreationActive, setSellerCreationActive] = useState(false);
  const [newSellerName, setNewSellerName] = useState("");
  const router = useRouter();
  if (session?.user.role !== "ADMIN" || status === "unauthenticated") {
    void router.push("/");
  }
  const categories = api.onload.getAllCategories.useQuery();
  const subcategories = api.onload.getSelectedSubcategories.useQuery({
    categoryId,
  });
  const sellers = api.onload.getAllSellers.useQuery();

  const sellerMutation = api.admin.createSeller.useMutation();

  const handleSellerCreation = async () => {
    try {
      await sellerMutation
        .mutateAsync({
          name: newSellerName,
        })

        .then(() => router.reload());
      return true;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSellerCreationToggle = () => {
    setSellerCreationActive(!sellerCreationActive);
  };

  return (
    <div className="w-full">
      <form>
        <h3>Add Product</h3>
        <div className="flex flex-col gap-4">
          <label className="flex flex-row justify-between gap-10">
            Name
            <input
              type="text"
              id="text"
              name="text"
              className="rounded-lg text-center text-black"
            />
          </label>

          <label className="flex flex-row justify-between gap-10">
            Description
            <input
              type="text"
              id="text"
              name="text"
              className="rounded-lg text-center text-black"
            />
          </label>
          <label className="flex flex-row justify-between gap-10">
            Price
            <input
              type="number"
              id="price"
              name="price"
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
              className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="flex flex-row justify-between gap-10">
              Preview Track
            </label>
            <input
              type="file"
              id="images"
              name="images"
              className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="flex flex-row justify-between gap-10">
              Product Download Upload
            </label>
            <input
              type="file"
              id="images"
              name="images"
              className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex flex-row justify-between gap-10">
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
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  className="bg-zinc-700 px-2"
                >
                  {sellers.data &&
                    sellers.data.map((seller) => (
                      <option key={seller.id} value={seller.id}>
                        {seller.name}
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
                    <input id="subcat" type="checkbox" value={subcategory.id} />
                    <label htmlFor="subcat" className="whitespace-nowrap">
                      {subcategory.name}
                    </label>
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
