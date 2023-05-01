import { type NextPage } from "next";
import Link from "next/link";
import ProductCard from "~/components/products/ProductCard";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const featureProductsQuery = api.products.getMainFeaturedProducts.useQuery();
  const effectCategoryQuery = api.onload.getSelectedSubcategories.useQuery({
    categoryId: 1,
  });
  const instrumentCategoryQuery = api.onload.getSelectedSubcategories.useQuery({
    categoryId: 2,
  });
  return (
    <div className="flex h-full w-full max-w-3xl flex-col gap-12 lg:max-w-5xl">
      <section className="flex w-full justify-center">
        <div className="flex h-32 w-3/4 items-center justify-center bg-white text-black">
          Featured Big Video
        </div>
      </section>
      <div className="flex flex-col">
        <section>
          <div className="flex w-full items-center justify-between">
            <h3 className="py-4">Featured Products</h3>
          </div>
          <div className="flex justify-around gap-2 overflow-x-scroll lg:gap-4">
            {featureProductsQuery.data &&
              featureProductsQuery.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>
        <section>
          <div className="flex w-full items-center justify-between">
            <h3 className="py-4">Shop Effects</h3>
          </div>
          <div className="flex justify-around gap-2 overflow-x-scroll lg:gap-4">
            {effectCategoryQuery.data &&
              effectCategoryQuery.data.map((category, i) => {
                if (i < 5) {
                  return (
                    <div key={category.id}>
                      <h5>{category.name}</h5>
                    </div>
                  );
                }
              })}
          </div>
        </section>
        <section className="flex flex-col">
          <h3>Check out our past battle winners</h3>
          <div className="border-b border-t border-zinc-600 py-2">
            <div>Beat</div>
          </div>
        </section>
        <section className="flex flex-col">
          <Link href={"/hi-pass"}>
            <h3>Read More</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <div>Image</div>
                <div className="flex w-full justify-between border border-zinc-700 px-4">
                  <h5>Curated</h5>
                  <button>READ MORE</button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div>Image</div>
                <div className="flex w-full justify-between border border-zinc-700 px-4">
                  <h5>Curated</h5>
                  <button>READ MORE</button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div>Image</div>
                <div className="flex w-full justify-between border border-zinc-700 px-4">
                  <h5>Curated</h5>
                  <button>READ MORE</button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div>Image</div>
                <div className="flex w-full justify-between border border-zinc-700 px-4">
                  <h5>Curated</h5>
                  <button>READ MORE</button>
                </div>
              </div>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
