import Header from "~/components/shared/header";

interface ForUsersLayoutProps {
  children: React.ReactNode;
}

export default function ForUsersLayout({ children }: ForUsersLayoutProps) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
