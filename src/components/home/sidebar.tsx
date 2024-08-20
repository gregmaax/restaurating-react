"use client";

import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import { Command, CommandItem, CommandList, CommandGroup } from "../ui/command";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export default function Sidebar() {
  return (
    <div className="flex min-h-screen w-1/4 flex-col border-r-[1px] border-black">
      <div className="flex flex-col gap-3 border-b-[1px] border-black px-1 py-4 text-center">
        <span className="text-xl font-semibold">Catégories header</span>
        <Button>
          <FaPlus />
          <span className="ml-2">Nouvelle catégorie</span>
        </Button>
      </div>
      <div className="grow">
        <ScrollArea className="min-h-screen w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-6 text-sm font-medium leading-none">
              Vos catégories
            </h4>
            <div>
              <div className="cursor-pointer">
                <Link href={"/#"}>
                  <span className="text-sm">Pizzerias</span>
                </Link>
              </div>

              <Separator className="my-2" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
