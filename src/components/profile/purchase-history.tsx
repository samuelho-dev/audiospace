import React, { useState } from "react";
import { api } from "~/utils/api";
import PurchaseHistoryItem from "../rating/PurchaseHistoryItem";

function PurchaseHistory() {
  const [detailView, setDetailView] = useState(false);
  const purchaseHistoryQuery = api.user.getPurchaseHistory.useQuery();
  console.log(purchaseHistoryQuery.data);

  return (
    <div>
      <h2>Purchase History</h2>

      <div>
        {purchaseHistoryQuery.data &&
          purchaseHistoryQuery.data.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900"
            >
              <button
                className={`${
                  detailView ? "rounded-t-lg" : "rounded-lg"
                } relative flex w-full items-center justify-between px-5 py-2 text-left text-base text-white transition focus:outline focus:outline-1 focus:outline-zinc-700`}
                type="button"
                onClick={() => setDetailView(!detailView)}
              >
                <div className="flex flex-col gap-2">
                  <h3>Invoice# {transaction.id}</h3>
                  <p>
                    ${transaction.total / 100} • {transaction.products.length}{" "}
                    items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div>{transaction.createdAt.toLocaleDateString()}</div>
                  <div>
                    <div
                      className={` ${
                        detailView ? "" : "rotate-[-180deg]"
                      } ml-auto h-5 w-5 shrink-0 transition-transform duration-200 ease-in-out `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        className="h-6 w-6"
                      >
                        <path
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          fill="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {detailView && (
                <div className="flex flex-col gap-4 px-5 py-4 transition-transform duration-200 ease-in-out">
                  {transaction.products.map((product) => (
                    <PurchaseHistoryItem
                      price={product.price}
                      quantity={product.quantity}
                      product={product.product}
                      key={product.product.id}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default PurchaseHistory;
