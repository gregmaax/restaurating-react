import "~/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { auth } from "~/auth";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/components/ui/sonner";

export const metadata = {
  title: "Restaurating",
  description:
    "Ajoutez, notez, et retrouvez facilement vos restaurants favoris.",
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
      <html lang="fr" className={`${GeistSans.variable} bg-panda-light-yellow`}>
        <head>
          <link
            rel="icon"
            type="image/png"
            href="/favicon-96x96.png"
            sizes="96x96"
          />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <title>Restaurating</title>
        </head>
        <body>
          <main>{children}</main>
          <Toaster richColors />
        </body>
      </html>
    </SessionProvider>
  );
}
