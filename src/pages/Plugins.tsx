import React from "react";
import ProductCard from "~/components/ProductCard";

function SidebarList() {
  return (
    <div className="flex flex-col">
      <h4>Instruments ⬇️</h4>
      <div className="ml-8">
        <p>Bass</p>
        <p>Drum Machine</p>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="flex w-2/6 flex-col items-center">
      <SidebarList />
    </div>
  );
}

function plugins() {
  return (
    <div className="h-full w-full">
      <div className="flex justify-center">
        <input type="text"></input>
      </div>
      <div className="flex w-full justify-between">
        <Sidebar />
        <div className="w-4/6">
          <h2>Instruments ⬇️</h2>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h3>Popular Instruments</h3>
              <div className="bg-white">
                <button className="w-6" />
                <button>h</button>
              </div>
            </div>
            <div className="flex overflow-x-clip">
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default plugins;
