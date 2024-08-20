import Sidebar from "~/components/categories/sidebar/sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex items-start justify-between">
      <Sidebar />
      {children}
    </div>
  );
}
