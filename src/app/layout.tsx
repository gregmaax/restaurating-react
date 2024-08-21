import "~/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { auth } from "~/auth";

import { GeistSans } from "geist/font/sans";
import Header from "~/components/shared/header";
import { Toaster } from "~/components/ui/sonner";

export const metadata = {
  title: "Restaurating",
  description: "Next.js playground for a restaurant app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="fr" className={`${GeistSans.variable}`}>
        <body className="overflow-hidden">
          <main className="flex h-full w-full flex-col gap-4">{children}</main>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
