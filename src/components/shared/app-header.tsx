"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, NotebookPen } from "lucide-react";
import { SidebarTrigger } from "~/components/ui/sidebar";

export function AppHeader() {
  const pathname = usePathname();
  return (
    <header className="flex h-[72px] items-center justify-between gap-4 border-b px-5 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger
          aria-label="Ouvrir ou fermer le menu"
          className="text-muted-foreground"
        />
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 text-sm"
        >
          <Link
            href="/categories"
            className={
              pathname === "/categories" || pathname === "/"
                ? "font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Mon carnet
          </Link>
          {pathname !== "/categories" && pathname !== "/" && (
            <>
              <ChevronRight
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="font-medium">Catégorie</span>
            </>
          )}
        </nav>
      </div>
      <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
        <NotebookPen className="h-4 w-4" aria-hidden="true" />
        Les bonnes tables restent.
      </span>
    </header>
  );
}
