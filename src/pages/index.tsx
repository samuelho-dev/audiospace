import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex h-full w-full max-w-3xl flex-col lg:max-w-5xl">
      <section>Featured Posts</section>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <section>
            <h3>Best Sellers</h3>
            <div>Something</div>
          </section>
          <section>
            <h3>Popular This Week</h3>
            <div>Something</div>
          </section>
        </div>
        <section className="flex flex-col">
          <h3>Featured Beats</h3>
          <div>Something</div>
        </section>
      </div>
    </div>
  );
};

export default Home;
