import React, { useState } from "react";
import StarRating from "./StarRating";
import { api } from "~/utils/api";
import { type ProductSchema } from "~/types/schema";
import Image from "next/image";

interface PurchaseHistoryItemProps {
  product: ProductSchema;
  quantity: number;
  price: number;
}
function PurchaseHistoryItem({
  product,
  quantity,
  price,
}: PurchaseHistoryItemProps) {
  const ratingQuery = api.user.getRatingForItem.useQuery({
    productId: product.id,
  });
  const ratingMutation = api.user.rateProduct.useMutation();
  const handleRating = async (rating: number) => {
    await ratingMutation.mutateAsync({ rating, productId: product.id });
  };

  console.log(ratingQuery.data);
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {product.images[0]?.imageUrl && (
          <Image
            src={product.images[0].imageUrl}
            alt="product image"
            width={100}
            height={100}
          />
        )}
        <div className="flex flex-col gap-1">
          <h3>{product.name}</h3>
          <p>{product.seller.user.username}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex justify-between gap-4">
          <p>qty: {quantity}</p>
          <p>${price / 100}</p>
        </div>
        <StarRating
          handleRating={handleRating}
          existingRating={ratingQuery.data ? ratingQuery.data.rating : null}
        />
      </div>
    </div>
  );
}

export default PurchaseHistoryItem;
