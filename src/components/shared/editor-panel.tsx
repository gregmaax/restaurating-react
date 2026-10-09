"use client";

import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export function EditorPanel({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="form-panel w-full overflow-y-auto bg-white p-6 sm:max-w-[510px] sm:p-8">
        <SheetHeader className="mb-8 border-b pb-6 pr-5 text-left">
          <SheetTitle className="text-2xl font-semibold tracking-tight">
            {title}
          </SheetTitle>
          <SheetDescription className="leading-relaxed">
            {description}
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
