import Link from "next/link";
import { type SVGProps } from "react";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { UserButton } from "../auth/user-button";
import { auth } from "~/auth";
import { currentUser } from "~/lib/auth";

export default async function Header() {
  const user = await currentUser();
  return (
    <header className="flex h-16 w-full shrink-0 items-center border-b px-4 md:px-20">
      <div className="flex flex-row gap-2">
        <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span>Gnitaruatser</span>
        </Link>
      </div>

      {user ? (
        <div className="ml-auto flex gap-2">
          <UserButton />
        </div>
      ) : null}
    </header>
  );
}

function DesktopNav() {
  return (
    <NavigationMenu className="mx-auto hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuLink asChild>
          <Link
            href="/"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground hover:underline focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            prefetch={false}
          >
            Accueil
          </Link>
        </NavigationMenuLink>
        <NavigationMenuLink asChild>
          <Link
            href="/categories"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground hover:underline focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            prefetch={false}
          >
            Categories
          </Link>
        </NavigationMenuLink>
        <NavigationMenuLink asChild>
          <Link
            href=""
            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground hover:underline focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            prefetch={false}
          >
            Restaurants
          </Link>
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader className={"hidden"}>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            Mobile navigation menu description.
          </SheetDescription>
        </SheetHeader>
        <Link href="/" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <div className="grid gap-2 py-6">
          <Link
            href="/"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Accueil
          </Link>
          <Link
            href="/categories"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Categories
          </Link>
          <Link
            href="#"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Restaurants
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
