import { spawnSync } from "node:child_process";

const command = process.argv[2];
if (!["generate", "migrate", "push", "studio"].includes(command)) {
  throw new Error(
    "Expected a database command: generate, migrate, push or studio.",
  );
}

function run(program, args) {
  const result = spawnSync(program, args, {
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (command === "migrate") {
  run(process.execPath, ["scripts/preflight-category-lifecycle.mjs"]);
}

run("pnpm", ["exec", "drizzle-kit", command]);
