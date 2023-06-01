import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

interface SidebarProps {
  setAdminPanelActive: (bool: boolean) => void;
  adminPanelActive: boolean;
}
function Sidebar({ adminPanelActive, setAdminPanelActive }: SidebarProps) {
  const { data: session } = useSession();
  const blogTagsQuery = api.blog.getBlogTags.useQuery(undefined, {
    cacheTime: Infinity,
  });
  const router = useRouter();
  const selectedTagNavigation = (tag: string) => {
    router
      .push(`/hi-pass/${tag.toLowerCase()}`, undefined, { shallow: true })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2 className="whitespace-nowrap py-4">Hi-Pass Blog</h2>
      <div>
        {blogTagsQuery.data &&
          blogTagsQuery.data.map((tag) => (
            <h5
              key={tag.id}
              onClick={() => selectedTagNavigation(tag.name)}
              className="px-2 font-bold tracking-tight hover:cursor-pointer hover:bg-zinc-500 hover:font-light hover:text-opacity-80"
            >
              {tag.name}
            </h5>
          ))}
        {session?.user.role === "ADMIN" && (
          <h5
            onClick={() => setAdminPanelActive(!adminPanelActive)}
            className="px-2 font-bold tracking-tight text-emerald-500 hover:cursor-pointer hover:bg-zinc-500 hover:font-light hover:text-opacity-80"
          >
            ADMIN PANEL
          </h5>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
