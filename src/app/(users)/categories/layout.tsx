import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { SideMenuWrapper } from "~/components/shared/side-menu-wrapper";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <SidebarProvider>
      <SideMenuWrapper />
      <div className={"w-full"}>
        <SidebarTrigger />
        {children}
      </div>
    </SidebarProvider>
  );
}
