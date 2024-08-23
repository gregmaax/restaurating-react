import Sidebar from "~/components/categories/sidebar/sidebar";
import SidebarDeux from "~/components/categories/sidebar/sidebar-deux";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex">
      <SidebarDeux />
      {children}
    </div>
  );
}
