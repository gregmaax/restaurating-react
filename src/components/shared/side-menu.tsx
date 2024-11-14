"use client";

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
} from "~/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { ExitIcon } from "@radix-ui/react-icons";
import { LogoutButton } from "~/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { CreateCategoryDialog } from "~/components/categories/create-category-dialog";
import { slugify } from "~/utils/string-utils";
import Link from "next/link";

import type { Category } from "~/server/db/schema";
import { User } from "next-auth";

export function SideMenu({
  categories,
  user,
}: {
  categories: Category[];
  user: (User & { role: "ADMIN" | "USER"; isOAuth: boolean }) | undefined;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <CreateCategoryDialog />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Catégories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.length === 0 ? <p>Aucune catégorie ajoutée</p> : null}
              {categories.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/categories/${slugify(category.slug)}`}>
                      <span className="flex-grow text-left">
                        {category.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className={"h-10"}>
                  <Avatar>
                    <AvatarImage src={user?.image ?? ""} />
                    <AvatarFallback>
                      <FaUser />
                    </AvatarFallback>
                  </Avatar>
                  {user?.name ?? null}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <LogoutButton>
                  <DropdownMenuItem className="cursor-pointer">
                    <ExitIcon className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </LogoutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
