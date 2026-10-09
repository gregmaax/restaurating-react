// Optional benchmark preload. Log table names only, never SQL values or credentials.
const originalFetch = globalThis.fetch;

globalThis.fetch = function (input, options) {
  const address =
    typeof input === "string" ? input : (input?.url ?? String(input));
  const url = new URL(address);
  if (url.hostname.endsWith(".neon.tech") && url.pathname === "/sql") {
    const payload = JSON.parse(options?.body ?? "{}");
    for (const query of payload.queries ?? [payload]) {
      const table =
        query.query?.match(/\bfrom\s+"?([a-z_]+)"?/i)?.[1] ?? "unknown";
      console.log("[PERF-DB]", JSON.stringify([table]));
    }
  }
  return originalFetch.call(this, input, options);
};
