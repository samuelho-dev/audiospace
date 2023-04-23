import React from "react";
import { api } from "~/utils/api";

function Wishlist() {
  const featuredInstrumentsQuery = api.plugins.getPopularInstruments.useQuery();

  if (featuredInstrumentsQuery.data) return null;
  return (
    <div>
      <h3>Wishlist</h3>
      <div className="flex items-start justify-between rounded-lg border border-zinc-500 p-4">
        <div>
          <h5>Item 1</h5>
          <p>Rating</p>
          <p>Description...</p>
          <p>Price</p>
        </div>
        <div>
          <div>Add to Cart</div>
          <div>Remove from list</div>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
