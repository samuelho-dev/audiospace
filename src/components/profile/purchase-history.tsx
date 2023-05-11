import type { Session } from "next-auth";
import React from "react";

interface PurchaseHistoryProps {
  session: Session;
}

function PurchaseHistory() {
  return (
    <div>
      <h2>Purchase History</h2>
      <div className="rounded-sm bg-zinc-900">
        <h5>Invoice Number</h5>
        <h5>Date Purchased</h5>
        <h5>Total</h5>
        <div>
          <h5>Product Name</h5>
          <div>Star rating</div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseHistory;
