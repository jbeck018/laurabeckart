import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_instagram_feed_fallback_posts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`link\` text,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_instagram_feed\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_instagram_feed_fallback_posts_order_idx\` ON \`pages_blocks_instagram_feed_fallback_posts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_instagram_feed_fallback_posts_parent_id_idx\` ON \`pages_blocks_instagram_feed_fallback_posts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_instagram_feed_fallback_posts_image_idx\` ON \`pages_blocks_instagram_feed_fallback_posts\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_instagram_feed\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Instagram',
  	\`username\` text,
  	\`limit\` numeric DEFAULT 8,
  	\`columns\` text DEFAULT '4',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_instagram_feed_order_idx\` ON \`pages_blocks_instagram_feed\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_instagram_feed_parent_id_idx\` ON \`pages_blocks_instagram_feed\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_instagram_feed_path_idx\` ON \`pages_blocks_instagram_feed\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_instagram_feed_fallback_posts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`link\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_instagram_feed\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_instagram_feed_fallback_posts_order_idx\` ON \`_pages_v_blocks_instagram_feed_fallback_posts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_instagram_feed_fallback_posts_parent_id_idx\` ON \`_pages_v_blocks_instagram_feed_fallback_posts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_instagram_feed_fallback_posts_image_idx\` ON \`_pages_v_blocks_instagram_feed_fallback_posts\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_instagram_feed\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'Instagram',
  	\`username\` text,
  	\`limit\` numeric DEFAULT 8,
  	\`columns\` text DEFAULT '4',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_instagram_feed_order_idx\` ON \`_pages_v_blocks_instagram_feed\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_instagram_feed_parent_id_idx\` ON \`_pages_v_blocks_instagram_feed\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_instagram_feed_path_idx\` ON \`_pages_v_blocks_instagram_feed\` (\`_path\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_instagram_feed_fallback_posts\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_instagram_feed\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_instagram_feed_fallback_posts\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_instagram_feed\`;`)
}
