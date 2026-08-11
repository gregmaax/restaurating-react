import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const sql = neon(databaseUrl);
const [{ categoryTableExists }] = await sql`
  SELECT to_regclass('public.category') IS NOT NULL AS "categoryTableExists"
`;

if (!categoryTableExists) {
  console.log(
    "Category lifecycle preflight: empty database, nothing to audit.",
  );
  process.exit(0);
}

const normalizedName = `trim(regexp_replace(lower(translate(
  "name",
  'ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖòóôõöÙÚÛÜùúûüÝŸýÿ',
  'AAAAAAaaaaaaCcEEEEeeeeIIIIiiiiNnOOOOOoooooUUUUuuuuYYyy'
)), E'\\s+', ' ', 'g'))`;

const columns = await sql`
  SELECT "column_name" FROM information_schema.columns
  WHERE "table_schema" = 'public' AND "table_name" = 'category'
`;
const columnNames = new Set(columns.map(({ column_name }) => column_name));
const nameKeyExpression = columnNames.has("nameKey")
  ? '"nameKey"'
  : normalizedName;
const reservedPredicate = columnNames.has("kind")
  ? `"nameKey" = 'sans categorie' AND "kind" <> 'UNASSIGNED'`
  : `${normalizedName} = 'sans categorie'`;

const [
  orphanRows,
  crossOwnerRows,
  duplicateSlugRows,
  nameConflictRows,
  reservedRows,
] = await Promise.all([
  sql`SELECT count(*)::int AS count
        FROM "restaurant" r
        LEFT JOIN "category" c ON c."id"::text = r."categoryId"::text
        WHERE c."id" IS NULL`,
  sql`SELECT count(*)::int AS count
        FROM "restaurant" r
        JOIN "category" c ON c."id"::text = r."categoryId"::text
        WHERE r."userId" <> c."userId"`,
  sql`SELECT count(*)::int AS count FROM (
          SELECT 1 FROM "category" GROUP BY "userId", "slug" HAVING count(*) > 1
        ) conflicts`,
  sql.query(
    `SELECT count(*)::int AS count FROM (
         SELECT 1 FROM "category"
         GROUP BY "userId", ${nameKeyExpression}
         HAVING count(*) > 1
       ) conflicts`,
    [],
  ),
  sql.query(
    `SELECT count(*)::int AS count FROM "category"
       WHERE ${reservedPredicate}`,
    [],
  ),
]);

const report = {
  orphanRestaurants: orphanRows[0]?.count ?? 0,
  crossOwnerRestaurants: crossOwnerRows[0]?.count ?? 0,
  duplicateSlugsPerUser: duplicateSlugRows[0]?.count ?? 0,
  normalizedNameConflicts: nameConflictRows[0]?.count ?? 0,
  reservedUnassignedNames: reservedRows[0]?.count ?? 0,
};

console.log("Category lifecycle preflight:", report);
if (Object.values(report).some((count) => count > 0)) {
  throw new Error("Resolve the reported data conflicts before migrating.");
}
