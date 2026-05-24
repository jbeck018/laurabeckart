import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_columns_media_idx\` ON \`pages_blocks_content_columns\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_carousel\` ADD \`content_type\` text DEFAULT 'products';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_three_item_grid\` ADD \`content_type\` text DEFAULT 'products';`)
  await db.run(sql`ALTER TABLE \`pages_rels\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_rels_media_id_idx\` ON \`pages_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_columns_media_idx\` ON \`_pages_v_blocks_content_columns\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_carousel\` ADD \`content_type\` text DEFAULT 'products';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_three_item_grid\` ADD \`content_type\` text DEFAULT 'products';`)
  await db.run(sql`ALTER TABLE \`_pages_v_rels\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_media_id_idx\` ON \`_pages_v_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`products_blocks_content_columns\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`products_blocks_content_columns_media_idx\` ON \`products_blocks_content_columns\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`_products_v_blocks_content_columns\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_content_columns_media_idx\` ON \`_products_v_blocks_content_columns\` (\`media_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_content_columns\`("_order", "_parent_id", "id", "size", "rich_text", "enable_link", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance") SELECT "_order", "_parent_id", "id", "size", "rich_text", "enable_link", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance" FROM \`pages_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_content_columns\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_content_columns\` RENAME TO \`pages_blocks_content_columns\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_columns_order_idx\` ON \`pages_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_columns_parent_id_idx\` ON \`pages_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`categories_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_rels\`("id", "order", "parent_id", "path", "pages_id", "categories_id", "products_id") SELECT "id", "order", "parent_id", "path", "pages_id", "categories_id", "products_id" FROM \`pages_rels\`;`)
  await db.run(sql`DROP TABLE \`pages_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_rels\` RENAME TO \`pages_rels\`;`)
  await db.run(sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_categories_id_idx\` ON \`pages_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_products_id_idx\` ON \`pages_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_content_columns\`("_order", "_parent_id", "id", "size", "rich_text", "enable_link", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance", "_uuid") SELECT "_order", "_parent_id", "id", "size", "rich_text", "enable_link", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance", "_uuid" FROM \`_pages_v_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_content_columns\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_content_columns\` RENAME TO \`_pages_v_blocks_content_columns\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_columns_order_idx\` ON \`_pages_v_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_columns_parent_id_idx\` ON \`_pages_v_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`categories_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_rels\`("id", "order", "parent_id", "path", "pages_id", "categories_id", "products_id") SELECT "id", "order", "parent_id", "path", "pages_id", "categories_id", "products_id" FROM \`_pages_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_rels\` RENAME TO \`_pages_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_order_idx\` ON \`_pages_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_parent_idx\` ON \`_pages_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_path_idx\` ON \`_pages_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_pages_id_idx\` ON \`_pages_v_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_categories_id_idx\` ON \`_pages_v_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_products_id_idx\` ON \`_pages_v_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_products_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_products_blocks_content_columns\`("_order", "_parent_id", "id", "size", "rich_text", "enable_link", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance") SELECT "_order", "_parent_id", "id", "size", "rich_text", "enable_link", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance" FROM \`products_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_content_columns\`;`)
  await db.run(sql`ALTER TABLE \`__new_products_blocks_content_columns\` RENAME TO \`products_blocks_content_columns\`;`)
  await db.run(sql`CREATE INDEX \`products_blocks_content_columns_order_idx\` ON \`products_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_content_columns_parent_id_idx\` ON \`products_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__products_v_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__products_v_blocks_content_columns\`("_order", "_parent_id", "id", "size", "rich_text", "enable_link", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance", "_uuid") SELECT "_order", "_parent_id", "id", "size", "rich_text", "enable_link", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance", "_uuid" FROM \`_products_v_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_content_columns\`;`)
  await db.run(sql`ALTER TABLE \`__new__products_v_blocks_content_columns\` RENAME TO \`_products_v_blocks_content_columns\`;`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_content_columns_order_idx\` ON \`_products_v_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_content_columns_parent_id_idx\` ON \`_products_v_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_carousel\` DROP COLUMN \`content_type\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_three_item_grid\` DROP COLUMN \`content_type\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_carousel\` DROP COLUMN \`content_type\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_three_item_grid\` DROP COLUMN \`content_type\`;`)
}
