import Header from "~/components/shared/header";

interface ForUsersLayoutProps {
  children: React.ReactNode;
}

export default function ForUsersLayout({ children }: ForUsersLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      {children}
    </div>
  );
}
