import { type NextPage } from "next";
import BeatDisplay from "~/components/BeatDisplay";
import ProductCard from "~/components/ProductCard";

const Home: NextPage = () => {
  return (
    <div className="flex h-full w-full max-w-3xl flex-col gap-12 lg:max-w-5xl">
      <section className="flex w-full justify-center">
        <div className="flex h-32 w-3/4 items-center justify-center bg-white text-black">
          Featured Posts
        </div>
      </section>
      <div className="flex justify-between">
        <div className="flex w-3/5 flex-col">
          <section>
            <h3 className="py-4">Best Sellers</h3>
            <div className="flex gap-4 overflow-x-clip">
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </div>
          </section>
          <section>
            <h3 className="py-4">Popular This Week</h3>
            <div className="flex gap-4 overflow-x-clip">
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </div>
          </section>
        </div>
        <section className="flex w-2/5 flex-col items-center">
          <h3 className="py-4">Beat Battle Winners</h3>
          <div className="flex w-full flex-col gap-4 px-6">
            <BeatDisplay />
            <BeatDisplay />
            <BeatDisplay />
            <BeatDisplay />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
