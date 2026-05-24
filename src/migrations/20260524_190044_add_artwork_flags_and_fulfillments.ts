import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`fulfillments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`type\` text,
  	\`size\` text,
  	\`quantity\` numeric DEFAULT 1,
  	\`product_id\` integer,
  	\`variant_id\` integer,
  	\`order_id\` integer,
  	\`customer_email\` text,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`variant_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`fulfillments_product_idx\` ON \`fulfillments\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`fulfillments_variant_idx\` ON \`fulfillments\` (\`variant_id\`);`)
  await db.run(sql`CREATE INDEX \`fulfillments_order_idx\` ON \`fulfillments\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`fulfillments_updated_at_idx\` ON \`fulfillments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`fulfillments_created_at_idx\` ON \`fulfillments\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_archive\` ADD \`product_type\` text DEFAULT 'all';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_archive\` ADD \`sort\` text DEFAULT '-createdAt';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_archive\` ADD \`product_type\` text DEFAULT 'all';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_archive\` ADD \`sort\` text DEFAULT '-createdAt';`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`is_original\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`is_printable\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_is_original\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_is_printable\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`fulfillments_id\` integer REFERENCES fulfillments(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_fulfillments_id_idx\` ON \`payload_locked_documents_rels\` (\`fulfillments_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`fulfillments\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`pages_id\` integer,
  	\`categories_id\` integer,
  	\`media_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`addresses_id\` integer,
  	\`variants_id\` integer,
  	\`variant_types_id\` integer,
  	\`variant_options_id\` integer,
  	\`products_id\` integer,
  	\`carts_id\` integer,
  	\`orders_id\` integer,
  	\`transactions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`addresses_id\`) REFERENCES \`addresses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variants_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_types_id\`) REFERENCES \`variant_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_options_id\`) REFERENCES \`variant_options\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`carts_id\`) REFERENCES \`carts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`transactions_id\`) REFERENCES \`transactions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "pages_id", "categories_id", "media_id", "forms_id", "form_submissions_id", "addresses_id", "variants_id", "variant_types_id", "variant_options_id", "products_id", "carts_id", "orders_id", "transactions_id") SELECT "id", "order", "parent_id", "path", "users_id", "pages_id", "categories_id", "media_id", "forms_id", "form_submissions_id", "addresses_id", "variants_id", "variant_types_id", "variant_options_id", "products_id", "carts_id", "orders_id", "transactions_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_addresses_id_idx\` ON \`payload_locked_documents_rels\` (\`addresses_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_variants_id_idx\` ON \`payload_locked_documents_rels\` (\`variants_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_variant_types_id_idx\` ON \`payload_locked_documents_rels\` (\`variant_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_variant_options_id_idx\` ON \`payload_locked_documents_rels\` (\`variant_options_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_carts_id_idx\` ON \`payload_locked_documents_rels\` (\`carts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_transactions_id_idx\` ON \`payload_locked_documents_rels\` (\`transactions_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_archive\` DROP COLUMN \`product_type\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_archive\` DROP COLUMN \`sort\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_archive\` DROP COLUMN \`product_type\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_archive\` DROP COLUMN \`sort\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`is_original\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`is_printable\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_is_original\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_is_printable\`;`)
}
