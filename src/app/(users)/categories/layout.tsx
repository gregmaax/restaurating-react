import SidebarDeux from "~/components/categories/sidebar/sidebar-deux";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <SidebarDeux />
      {children}
    </div>
  );
}
