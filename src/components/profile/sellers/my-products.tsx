import Decimal from "decimal.js";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { type ProductSchema } from "~/types/schema";
import { api } from "~/utils/api";

interface EditProductProps {
  product: ProductSchema;
  i: number;
  setCurProductId: (value: string) => void;
}

function EditProduct({ product, i, setCurProductId }: EditProductProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const productUpdateMutation =
    api.sellerprofile.updateSellerProduct.useMutation();

  const handleSubmitProductUpdate = async () => {
    const revisedForm = { ...form };
    revisedForm.price = new Decimal(revisedForm.price);
    await productUpdateMutation.mutateAsync(revisedForm);
    router.reload();
  };

  return (
    <div
      key={product.id}
      className={`grid grid-cols-7 items-center gap-2 justify-self-center px-2 ${
        i % 2 !== 0 ? "border-b border-zinc-500" : ""
      }`}
    >
      <input
        type="text"
        value={form.name}
        name="name"
        onChange={handleChange}
        className="flex h-10 w-full items-center justify-center text-start text-sm text-black"
      />
      <p className="flex h-10 w-full items-center justify-center text-start text-sm">
        {product.images.length} Images
      </p>
      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        className="flex h-10 w-full items-center justify-center text-start text-sm text-black"
      />
      <p className="flex h-10 w-full items-center justify-center text-start text-sm">
        {product.category.name}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {product.subcategory.map((subcat) => (
          <div
            className="rounded-lg border border-zinc-700 px-1 text-xs"
            key={subcat.id}
          >
            {subcat.name}
          </div>
        ))}
      </div>
      <input
        type="number"
        value={Number(form.price)}
        name="price"
        onChange={handleChange}
        className="flex h-10 w-full items-center justify-center text-start text-sm text-black"
      />

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setCurProductId("")}
          className="rounded-lg border border-zinc-400 px-1 text-xs hover:bg-zinc-500"
        >
          X
        </button>
        <button
          onClick={() => void handleSubmitProductUpdate()}
          className="rounded-lg border border-zinc-400 px-1 text-xs hover:bg-zinc-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function MyProducts() {
  const [curProductId, setCurProductId] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();
  if (session?.user.role !== "SELLER" && session?.user.role !== "ADMIN") {
    void router.push("/");
  }

  const sellerProductQuery = api.sellerprofile.getSellerProduct.useQuery();

  if (!sellerProductQuery.data) {
    return null;
  }
  const productTableHeaders = [
    "Name",
    "Images",
    "Description",
    "Category",
    "Subcategory",
    "Price",
  ];

  return (
    <div>
      <div className="my-2 grid grid-cols-7 items-center gap-2 justify-self-center border-b py-2">
        {productTableHeaders.map((header, i) => (
          <h5
            className="flex h-10 w-full items-center justify-center border border-zinc-500 align-middle text-xs underline underline-offset-4"
            key={i}
          >
            {header}
          </h5>
        ))}
      </div>
      <div className="bg-zinc-900">
        {sellerProductQuery.data.products.map((product, i) =>
          curProductId === product.id ? (
            <EditProduct
              key={product.id}
              product={product}
              i={i}
              setCurProductId={setCurProductId}
            />
          ) : (
            <div
              key={product.id}
              className={`grid grid-cols-7 items-center gap-2 justify-self-center px-2 ${
                i % 2 !== 0 ? "border-b border-zinc-500" : ""
              }`}
            >
              <p className="flex h-10 w-full items-center justify-center text-start text-sm">
                {product.name}
              </p>
              <p className="flex h-10 w-full items-center justify-center text-start text-sm">
                {product.images.length} Images
              </p>
              <p className="flex h-10 w-full items-center justify-center text-start text-sm">
                {product.description}
              </p>
              <p className="flex h-10 w-full items-center justify-center text-start text-sm">
                {product.category.name}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {product.subcategory.map((subcat) => (
                  <div
                    className="rounded-lg border border-zinc-700 px-1 text-xs"
                    key={subcat.id}
                  >
                    {subcat.name}
                  </div>
                ))}
              </div>
              <p className="flex h-10 w-full items-center justify-center text-start text-sm">
                {Number(product.price)}
              </p>
              <button
                onClick={() => setCurProductId(product.id)}
                className="rounded-lg border border-zinc-400 text-xs hover:bg-zinc-500"
              >
                Edit
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MyProducts;
