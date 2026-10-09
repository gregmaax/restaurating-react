import { SideMenu } from "~/components/shared/side-menu";
import { getSpecificUserCategories } from "~/server/queries/categories";
import { currentUser } from "~/lib/auth";

export async function SideMenuWrapper() {
  const [categories, user] = await Promise.all([
    getSpecificUserCategories(),
    currentUser(),
  ]);

  return <SideMenu categories={categories} user={user} />;
}
