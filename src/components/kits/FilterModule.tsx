import { type CategorySchema } from "~/types/schema";
import FilterBtn from "../buttons/FilterBtn";
import { useRouter } from "next/router";

interface FilterProps {
  categories: CategorySchema[];
  handleRoute: (category: string, subcategory?: string) => void;
}
export default function FilterModule({ categories, handleRoute }: FilterProps) {
  const router = useRouter();
  const { category, tag } = router.query;
  const handleFilterClick = (
    categoryName: string,
    subcategoryName?: string
  ) => {
    handleRoute(categoryName, subcategoryName);
  };
  return (
    <div className="flex w-full flex-col justify-center gap-4 rounded-lg p-4 outline outline-1 outline-zinc-700">
      <h5>Tags</h5>
      <div className="flex flex-wrap gap-3">
        {categories &&
          categories.map((category) => (
            <>
              {category.subcategories &&
                category.subcategories.map((subcategory) => (
                  <FilterBtn
                    key={subcategory.id}
                    active={
                      tag ===
                        subcategory.name.toLowerCase().replace(" ", "-") ||
                      tag?.includes(
                        subcategory.name.toLowerCase().replace(" ", "-")
                      )
                        ? true
                        : false
                    }
                  >
                    <div
                      className="flex gap-2"
                      onClick={() =>
                        handleFilterClick(category.name, subcategory.name)
                      }
                    >
                      <p className="text-xs">{subcategory.name}</p>
                      <p className="text-xs text-zinc-400">
                        {subcategory._count && subcategory._count.products}
                      </p>
                    </div>
                  </FilterBtn>
                ))}
            </>
          ))}
      </div>
    </div>
  );
}