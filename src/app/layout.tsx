import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import Header from "~/components/shared/header";

export const metadata = {
  title: "Restaurating",
  description: "Next.js playground for a restaurant app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <div>Categories</div>
      <button>Sign in</button>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} flex flex-col gap-4`}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
