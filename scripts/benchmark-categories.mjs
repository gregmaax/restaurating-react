import { performance } from "node:perf_hooks";
import { readFile, writeFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { encode } from "next-auth/jwt";

const base = new URL(process.env.BENCHMARK_URL ?? "http://localhost:3000");
if (
  !["localhost", "127.0.0.1"].includes(base.hostname) ||
  base.protocol !== "http:"
) {
  throw new Error(
    "This authenticated benchmark only supports local HTTP servers.",
  );
}
const userId = process.env.BENCHMARK_USER_ID;
if (!userId || !process.env.DATABASE_URL || !process.env.AUTH_SECRET) {
  throw new Error(
    "BENCHMARK_USER_ID, DATABASE_URL and AUTH_SECRET are required.",
  );
}
const sampleCount = Number(process.env.BENCHMARK_SAMPLES ?? 21);
if (!Number.isInteger(sampleCount) || sampleCount < 3 || sampleCount > 200) {
  throw new Error("BENCHMARK_SAMPLES must be an integer between 3 and 200.");
}
const sql = neon(process.env.DATABASE_URL);
const categories = await sql`
  SELECT c.id, s.slug FROM category c
  INNER JOIN category_slug s ON s."categoryId" = c.id AND s."isCanonical" = true
  WHERE c."userId" = ${userId} ORDER BY c.id LIMIT 3
`;
if (categories.length < 2)
  throw new Error("The benchmark user needs at least two categories.");

// A short-lived test session stays in memory. No login/account writes or browser cookies.
const cookieName = "authjs.session-token";
const token = await encode({
  token: { sub: userId },
  secret: process.env.AUTH_SECRET,
  salt: cookieName,
  maxAge: 900,
});
const traceFile = process.env.BENCHMARK_TRACE_FILE;
const countQueries = async () => {
  if (!traceFile) return undefined;
  const trace = await readFile(traceFile, "utf8");
  return trace.split("\n").filter((line) => line.startsWith("[PERF-DB] "))
    .length;
};
const samples = [];
for (let i = 0; i < sampleCount + 3; i++) {
  const source = categories[i % categories.length];
  const target = categories[(i + 1) % categories.length];
  const routerState = [
    "",
    {
      children: [
        "(users)",
        {
          children: [
            "categories",
            {
              children: [
                ["categorySlug", source.slug, "d"],
                { children: ["__PAGE__", {}] },
              ],
            },
          ],
        },
      ],
    },
    null,
    null,
    true,
  ];
  const queryStart = await countQueries();
  const start = performance.now();
  const response = await fetch(
    new URL(`/categories/${encodeURIComponent(target.slug)}`, base),
    {
      redirect: "manual",
      headers: {
        Cookie: `${cookieName}=${token}`,
        RSC: "1",
        "Next-Router-State-Tree": encodeURIComponent(
          JSON.stringify(routerState),
        ),
      },
    },
  );
  const body = await response.text();
  const ms = performance.now() - start;
  if (
    response.status !== 200 ||
    !response.headers.get("content-type")?.includes("text/x-component") ||
    !body.includes(target.id)
  ) {
    throw new Error(
      `Category navigation did not render the requested category: HTTP ${response.status}`,
    );
  }
  const queryEnd = await countQueries();
  if (i >= 3)
    samples.push({
      ms,
      queries: queryStart === undefined ? undefined : queryEnd - queryStart,
    });
}

const durations = samples.map((sample) => sample.ms).sort((a, b) => a - b);
const result = {
  label: process.env.BENCHMARK_LABEL ?? "category-navigation",
  samples: sampleCount,
  warmups: 3,
  medianMs: durations[Math.floor(sampleCount / 2)],
  p90Ms: durations[Math.ceil(sampleCount * 0.9) - 1],
  meanMs: durations.reduce((sum, ms) => sum + ms, 0) / sampleCount,
  queriesPerNavigation: traceFile
    ? [...new Set(samples.map((sample) => sample.queries))]
    : undefined,
  measurements: samples,
};
if (process.env.BENCHMARK_OUTPUT) {
  await writeFile(
    process.env.BENCHMARK_OUTPUT,
    JSON.stringify(result, null, 2) + "\n",
  );
}
console.log(JSON.stringify({ ...result, measurements: undefined }, null, 2));
if (
  process.env.BENCHMARK_MAX_MS &&
  result.medianMs > Number(process.env.BENCHMARK_MAX_MS)
) {
  console.error("Category navigation exceeded the median latency budget.");
  process.exitCode = 1;
}
if (process.env.BENCHMARK_MAX_QUERIES) {
  if (!traceFile)
    throw new Error(
      "BENCHMARK_TRACE_FILE is required to check the query budget.",
    );
  if (
    samples.some(
      (sample) => sample.queries > Number(process.env.BENCHMARK_MAX_QUERIES),
    )
  ) {
    console.error("Category navigation exceeded the database query budget.");
    process.exitCode = 1;
  }
}
