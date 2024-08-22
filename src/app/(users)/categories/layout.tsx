import Sidebar from "~/components/categories/sidebar/sidebar";
import SidebarDeux from "~/components/categories/sidebar/sidebar-deux";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex items-start justify-between">
      <SidebarDeux />
      {children}
    </div>
  );
}
