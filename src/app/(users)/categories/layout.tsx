import Sidebar from "~/components/shared/sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      {children}
    </div>
  );
}
