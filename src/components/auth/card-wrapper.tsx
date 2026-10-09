"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import Header from "~/components/auth/header";
import Social from "~/components/auth/social";
import BackButton from "~/components/auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export default function CardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) {
  return (
    <Card className="w-full max-w-[420px] rounded-2xl border bg-white p-3 shadow-[0_12px_60px_rgba(104,64,39,0.07)]">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="pb-7">{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
}
