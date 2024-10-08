// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
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

export const categories = createTable("category", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  slug: varchar("slug", { length: 30 }).notNull(),
  description: varchar("description", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
  userId: varchar("userId", { length: 256 }).notNull(),
});

export type Category = typeof categories.$inferSelect;

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
    categoryId: varchar("categoryId", { length: 256 }).notNull(),
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
