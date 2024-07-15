import { Poppins } from "next/font/google";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function HomePage() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className,
          )}
        >
          Restaurating
        </h1>
        <p>Gardez trace et notez vos restaurants.</p>
        <div>
          <Button variant={"secondary"} size={"lg"}>
            Connexion
          </Button>
        </div>
      </div>
    </main>
  );
}
