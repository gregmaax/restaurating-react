import SidebarHeader from "./sidebar-header";
import SidebarContent from "./sidebar-content";
import { getSpecificUserCategories } from "~/server/queries/categories";

export default async function Sidebar() {
  const categories = await getSpecificUserCategories();
  return (
    <div className="flex min-h-screen w-1/4 flex-col border-r-[1px] border-black">
      <SidebarHeader />
      <div className="grow">
        <SidebarContent categories={categories} />
      </div>
    </div>
  );
}
