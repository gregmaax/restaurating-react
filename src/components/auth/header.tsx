import { Brand } from "~/components/shared/brand";

export default function Header({ label }: { label: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <Brand />
      <h1 className="text-2xl font-semibold tracking-tight">{label}</h1>
    </div>
  );
}
