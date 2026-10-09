import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const sql = neon(process.env.DATABASE_URL);

try {
  await sql`
    SELECT c."nameKey", c."kind", s."slug", s."isCanonical", r."categoryId"
    FROM "category" c
    LEFT JOIN "category_slug" s ON s."categoryId" = c."id"
    LEFT JOIN "restaurant" r ON r."categoryId" = c."id"
    LIMIT 0
  `;
  console.log("Database schema check passed.");
} catch (error) {
  if (error.code === "42P01" || error.code === "42703") {
    console.error(
      "Database schema is out of date. Check DATABASE_URL points to your dev branch, then run pnpm db:migrate.",
    );
    process.exitCode = 1;
  } else {
    throw error;
  }
}
