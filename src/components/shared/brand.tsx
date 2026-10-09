import Image from "next/image";

export function Brand() {
  return (
    <span className="flex items-center gap-3">
      <Image
        src="/favicon.svg"
        width={42}
        height={42}
        alt=""
        className="shrink-0 rounded-xl"
      />
      <span className="text-xl font-semibold tracking-[-0.06em] text-foreground">
        restaurating<span className="text-primary">.</span>
      </span>
    </span>
  );
}
