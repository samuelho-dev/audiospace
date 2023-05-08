import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

function Sidebar() {
  const blogTagsQuery = api.blog.getBlogTags.useQuery();
  const router = useRouter();
  const selectedTagNavigation = (tag: string) => {
    router
      .push(`/hi-pass/${tag.toLowerCase()}`, undefined, { shallow: true })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2 className="whitespace-nowrap">Hi-Pass Blog</h2>
      {blogTagsQuery.data &&
        blogTagsQuery.data.map((tag) => (
          <div key={tag.id} onClick={() => selectedTagNavigation(tag.name)}>
            <h5 className="font-bold hover:cursor-pointer hover:bg-zinc-500 hover:text-opacity-80">
              {tag.name}
            </h5>
          </div>
        ))}
    </div>
  );
}

export default Sidebar;
