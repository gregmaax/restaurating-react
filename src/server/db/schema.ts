// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const categoryKindEnum = pgEnum("category_kind", [
  "ORDINARY",
  "UNASSIGNED",
]);

export const categories = createTable(
  "category",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 30 }).notNull(),
    nameKey: varchar("nameKey", { length: 64 }).notNull(),
    // Kept during the expand phase so the previous deployment remains valid.
    slug: varchar("slug", { length: 64 }).notNull(),
    kind: categoryKindEnum("kind").default("ORDINARY").notNull(),
    description: varchar("description", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
    userId: varchar("userId", { length: 256 }).notNull(),
  },
  (category) => ({
    uniqueNamePerUser: uniqueIndex("category_user_name_key_unique").on(
      category.userId,
      category.nameKey,
    ),
    oneUnassignedPerUser: uniqueIndex("category_user_unassigned_unique")
      .on(category.userId)
      .where(sql`${category.kind} = 'UNASSIGNED'`),
    reservedUnassignedName: check(
      "category_reserved_unassigned_name",
      sql`${category.kind} = 'UNASSIGNED' OR ${category.nameKey} <> 'sans categorie'`,
    ),
  }),
);

export type Category = typeof categories.$inferSelect;

export const categorySlugs = createTable(
  "category_slug",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    categoryId: uuid("categoryId")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    userId: varchar("userId", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 64 }).notNull(),
    isCanonical: boolean("isCanonical").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (categorySlug) => ({
    uniqueSlugPerUser: uniqueIndex("category_slug_user_slug_unique").on(
      categorySlug.userId,
      categorySlug.slug,
    ),
    oneCanonicalPerCategory: uniqueIndex("category_slug_canonical_unique")
      .on(categorySlug.categoryId)
      .where(sql`${categorySlug.isCanonical}`),
    categoryLookup: index("category_slug_category_idx").on(
      categorySlug.categoryId,
    ),
  }),
);

export const restaurants = createTable(
  "restaurant",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    city: varchar("city", { length: 45 }).notNull(),
    name: varchar("name", { length: 30 }).notNull(),
    description: varchar("description", { length: 256 }),
    rating: integer("rating"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
    categoryId: uuid("categoryId")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    // Kept during the expand phase; ownership is derived from Category.
    userId: varchar("userId", { length: 256 }).notNull(),
  },
  (restaurant) => {
    // Table-level check constraint for rating between 1 and 5
    return {
      ratingCheck: sql`CHECK (${restaurant.rating} IS NULL OR (${restaurant.rating} >= 1 AND ${restaurant.rating} <= 5))`,
    };
  },
);

export type Restaurant = typeof restaurants.$inferSelect;

//AUTH
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const users = createTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").notNull().default("USER"),
});

export const accounts = createTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const verification_tokens = createTable(
  "verification_token",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("emailVerified", { mode: "date" }).notNull(),
  },
  (verification_token) => ({
    uniqueEmailToken: uniqueIndex("unique_email_token").on(
      verification_token.email,
      verification_token.token,
    ),
  }),
);

export const password_reset_tokens = createTable(
  "password_reset_token",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("emailVerified", { mode: "date" }).notNull(),
  },
  (password_reset_token) => ({
    uniqueEmailToken: uniqueIndex("unique_pw_reset_token").on(
      password_reset_token.email,
      password_reset_token.token,
    ),
  }),
);
