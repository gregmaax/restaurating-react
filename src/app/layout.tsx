import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import Header from "~/components/shared/header";
import { Toaster } from "~/components/ui/sonner";

export const metadata = {
  title: "Restaurating",
  description: "Next.js playground for a restaurant app",
  icons: [{ rel: "icon", url: "./favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${GeistSans.variable} flex flex-col gap-4`}>
      <body>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
