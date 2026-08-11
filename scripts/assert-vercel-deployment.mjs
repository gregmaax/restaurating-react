const deploymentEnvironments = new Set(["preview", "production"]);

if (!deploymentEnvironments.has(process.env.VERCEL_ENV)) {
  throw new Error(
    "Deployment migrations may only run in a Vercel Preview or Production build.",
  );
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run deployment migrations.");
}

console.log(`Running tracked migrations for Vercel ${process.env.VERCEL_ENV}.`);
