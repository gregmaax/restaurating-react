import { SidebarProvider } from "~/components/ui/sidebar";
import { SideMenuWrapper } from "~/components/shared/side-menu-wrapper";
import { AppHeader } from "~/components/shared/app-header";

export const dynamic = "force-dynamic";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:absolute"
      >
        Aller au contenu
      </a>
      <SideMenuWrapper />
      <div className="app-surface">
        <AppHeader />
        <main id="main-content" className="page-content">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
