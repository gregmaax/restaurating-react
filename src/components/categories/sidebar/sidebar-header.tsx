import { FaPlus } from "react-icons/fa";
import { Button } from "~/components/ui/button";
import { CreateCategoryDialog } from "../create-category-dialog";

export default function SidebarHeader() {
  return (
    <div className="flex flex-col gap-3 border-b-[1px] border-black px-1 py-4 text-center">
      <span className="text-xl font-semibold">Catégories</span>
      <CreateCategoryDialog />
    </div>
  );
}
