export const metadata = {
  title: "Restaurating",
  description: "Votre carnet personnel de restaurants.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center">{children}</div>
  );
}
