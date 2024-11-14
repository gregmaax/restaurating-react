import { Poppins } from "next/font/google";
import SigninButton from "~/components/auth/signin-button";
import { Button } from "~/components/ui/button";
import { cn } from "~/components/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function HomePage() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-primary drop-shadow-md",
            font.className,
          )}
        >
          🍽️ Restaurating
        </h1>
        <div>
          <SigninButton mode="modal" asChild>
            <Button variant="custom_primary" size="lg">
              Connexion
            </Button>
          </SigninButton>
        </div>
      </div>
    </main>
  );
}
