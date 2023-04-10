import { useRouter } from "next/router";

export const useRouterFilter = () => {
  const { pathname, query, push } = useRouter();

  const toggleParam = (paramName: string, value: string) => {
    const currentParam = query[paramName];

    let updatedParamValues;
    if (!currentParam) {
      updatedParamValues = [value];
    } else {
      const paramArray = Array.isArray(currentParam)
        ? currentParam
        : [currentParam];
      updatedParamValues = paramArray.includes(value)
        ? paramArray.filter((item) => item !== value)
        : [...paramArray, value];
    }

    const newQuery = {
      ...query,
      [paramName]: updatedParamValues,
    };

    void push(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleRoute = (category: string, subcategory?: string) => {
    const categoryName = "category";
    const tagName = "tag";

    toggleParam(categoryName, category.toLowerCase());

    if (subcategory) {
      toggleParam(tagName, subcategory.toLowerCase().replace(" ", "-"));
    }
  };

  return {
    handleRoute,
  };
};
