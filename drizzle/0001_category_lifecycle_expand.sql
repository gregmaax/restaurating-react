DO $$ BEGIN
	IF EXISTS (
		SELECT 1
		FROM "restaurant" r
		LEFT JOIN "category" c ON c."id"::text = r."categoryId"
		WHERE c."id" IS NULL
	) THEN
		RAISE EXCEPTION 'category lifecycle preflight: orphan restaurants exist';
	END IF;

	IF EXISTS (
		SELECT 1
		FROM "restaurant" r
		JOIN "category" c ON c."id"::text = r."categoryId"
		WHERE r."userId" <> c."userId"
	) THEN
		RAISE EXCEPTION 'category lifecycle preflight: restaurant/category ownership differs';
	END IF;

	IF EXISTS (
		SELECT 1
		FROM "category"
		GROUP BY "userId", trim(regexp_replace(lower(translate(
			"name",
			'ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖòóôõöÙÚÛÜùúûüÝŸýÿ',
			'AAAAAAaaaaaaCcEEEEeeeeIIIIiiiiNnOOOOOoooooUUUUuuuuYYyy'
		)), E'\\s+', ' ', 'g'))
		HAVING count(*) > 1
	) THEN
		RAISE EXCEPTION 'category lifecycle preflight: normalized category-name conflicts exist';
	END IF;

	IF EXISTS (
		SELECT 1 FROM "category" GROUP BY "userId", "slug" HAVING count(*) > 1
	) THEN
		RAISE EXCEPTION 'category lifecycle preflight: duplicate category slugs exist';
	END IF;

	IF EXISTS (
		SELECT 1
		FROM "category"
		WHERE trim(regexp_replace(lower(translate(
			"name",
			'ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖòóôõöÙÚÛÜùúûüÝŸýÿ',
			'AAAAAAaaaaaaCcEEEEeeeeIIIIiiiiNnOOOOOoooooUUUUuuuuYYyy'
		)), E'\\s+', ' ', 'g')) = 'sans categorie'
	) THEN
		RAISE EXCEPTION 'category lifecycle preflight: reserved Sans catégorie name already exists';
	END IF;
END $$;
--> statement-breakpoint
CREATE TYPE "public"."category_kind" AS ENUM('ORDINARY', 'UNASSIGNED');
--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "slug" SET DATA TYPE varchar(64);
--> statement-breakpoint
ALTER TABLE "restaurant" ALTER COLUMN "categoryId" SET DATA TYPE uuid USING "categoryId"::uuid;
--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "nameKey" varchar(64);
--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "kind" "category_kind" DEFAULT 'ORDINARY' NOT NULL;
--> statement-breakpoint
UPDATE "category"
SET "nameKey" = trim(regexp_replace(lower(translate(
	"name",
	'ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖòóôõöÙÚÛÜùúûüÝŸýÿ',
	'AAAAAAaaaaaaCcEEEEeeeeIIIIiiiiNnOOOOOoooooUUUUuuuuYYyy'
)), E'\\s+', ' ', 'g'));
--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "nameKey" SET NOT NULL;
--> statement-breakpoint
CREATE TABLE "category_slug" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"categoryId" uuid NOT NULL,
	"userId" varchar(256) NOT NULL,
	"slug" varchar(64) NOT NULL,
	"isCanonical" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO "category_slug" ("categoryId", "userId", "slug", "isCanonical")
SELECT "id", "userId", "slug", true FROM "category";
--> statement-breakpoint
ALTER TABLE "category_slug" ADD CONSTRAINT "category_slug_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "category_slug_user_slug_unique" ON "category_slug" USING btree ("userId","slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "category_slug_canonical_unique" ON "category_slug" USING btree ("categoryId") WHERE "category_slug"."isCanonical";
--> statement-breakpoint
CREATE INDEX "category_slug_category_idx" ON "category_slug" USING btree ("categoryId");
--> statement-breakpoint
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "category_user_name_key_unique" ON "category" USING btree ("userId","nameKey");
--> statement-breakpoint
CREATE UNIQUE INDEX "category_user_unassigned_unique" ON "category" USING btree ("userId") WHERE "category"."kind" = 'UNASSIGNED';
--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_reserved_unassigned_name" CHECK ("category"."kind" = 'UNASSIGNED' OR "category"."nameKey" <> 'sans categorie');
