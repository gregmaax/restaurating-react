import { Poppins } from "next/font/google";
import LoginButton from "~/components/auth/login-button";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function HomePage() {
  return (
    <main className="flex h-[75%] flex-col items-center justify-center">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className,
          )}
        >
          🍽️ Restaurating
        </h1>
        <p>Gardez trace et notez vos restaurants.</p>
        <div>
          <LoginButton>
            <Button variant={"secondary"} size={"lg"}>
              Connexion
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
