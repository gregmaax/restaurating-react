"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ChevronUp,
  Folder,
  Heart,
  LogOut,
  LockKeyhole,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { LogoutButton } from "~/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CreateCategoryDialog } from "~/components/categories/create-category-dialog";
import { Brand } from "./brand";
import { Button } from "~/components/ui/button";
import type { Category } from "~/server/db/schema";
import type { User } from "next-auth";

export function SideMenu({
  categories,
  user,
  preview = false,
}: {
  categories: Category[];
  user: (User & { role: "ADMIN" | "USER"; isOAuth: boolean }) | undefined;
  preview?: boolean;
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const initials =
    user?.name
      ?.split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() ?? "U";
  return (
    <Sidebar className="border-none" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="gap-7 px-5 pb-5 pt-7">
        <Link
          href={preview ? "/" : "/categories"}
          aria-label="Restaurating, accueil"
        >
          <Brand />
        </Link>
        {preview ? (
          <Button asChild>
            <Link href="/auth/signin">Créer mon carnet</Link>
          </Button>
        ) : (
          <CreateCategoryDialog />
        )}
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={preview || pathname === "/categories"}
                  className="h-11 rounded-lg px-3 font-medium data-[active=true]:border data-[active=true]:shadow-sm"
                >
                  <Link
                    href={preview ? "/" : "/categories"}
                    onClick={() => setOpenMobile(false)}
                  >
                    <BookOpen />
                    <span>Mon carnet</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-3">
          <SidebarGroupLabel className="mb-2 flex justify-between px-3 text-xs">
            Mes catégories
            <span className="rounded bg-sand/40 px-1.5 py-0.5 tabular-nums">
              {categories.length}
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.length === 0 && (
                <p className="px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  Créez une catégorie pour regrouper vos restaurants.
                </p>
              )}
              {categories.map((category, index) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      !preview && pathname === `/categories/${category.slug}`
                    }
                    className="h-11 rounded-lg px-3 data-[active=true]:border data-[active=true]:shadow-sm"
                  >
                    <Link
                      href={
                        preview
                          ? "/auth/signin"
                          : `/categories/${category.slug}`
                      }
                      onClick={() => setOpenMobile(false)}
                    >
                      <Folder
                        className={
                          index % 3 === 0
                            ? "text-coral"
                            : index % 3 === 1
                              ? "text-[#bd862d]"
                              : "text-cocoa"
                        }
                      />
                      <span className="truncate">{category.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mx-2 mt-auto rounded-xl bg-secondary/80 p-4">
          <Heart className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            Le goût des bons souvenirs
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            La petite trattoria, le brunch du dimanche… Gardez les tables qui
            comptent.
          </p>
        </div>
      </SidebarContent>
      <SidebarFooter className="m-4 mt-6 border-t px-0 pt-4">
        {preview ? (
          <p className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <LockKeyhole className="h-3.5 w-3.5" />
            Un carnet personnel et privé
          </p>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-14 px-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.image ?? ""} alt="" />
                      <AvatarFallback className="bg-[#ffe2d5] text-xs font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {user?.name?.trim() ? user.name : "Mon profil"}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </span>
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <LogoutButton>
                    <DropdownMenuItem className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </LogoutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
