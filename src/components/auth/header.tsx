import { Poppins } from "next/font/google";
import { cn } from "~/components/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export default function Header({ label }: HeaderProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1 className={cn("text-3xl font-semibold", font.className)}>
        🔐 Identifiez-vous
      </h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
