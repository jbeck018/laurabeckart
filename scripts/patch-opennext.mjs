#!/usr/bin/env node
/**
 * Patches the OpenNext bundle-server.js to externalize drizzle-kit.
 * Adds an esbuild plugin that marks any drizzle-kit imports as external.
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const bundleServerPath = resolve(
  'node_modules/@opennextjs/cloudflare/dist/cli/build/bundle-server.js',
)

const content = readFileSync(bundleServerPath, 'utf-8')

if (content.includes('drizzle-kit-external')) {
  console.log('OpenNext already patched for drizzle-kit, skipping.')
  process.exit(0)
}

// Add an esbuild plugin to the plugins array that externalizes drizzle-kit
const pluginCode = `{
              name: "drizzle-kit-external",
              setup(build) {
                build.onResolve({ filter: /drizzle-kit/ }, (args) => ({
                  path: args.path,
                  external: true,
                }));
              },
            },`

const patched = content.replace(
  'plugins: [',
  `plugins: [\n            ${pluginCode}`,
)

if (patched === content) {
  console.error('Failed to find esbuild plugins array in bundle-server.js')
  process.exit(1)
}

writeFileSync(bundleServerPath, patched)
console.log('Patched OpenNext bundle-server.js to externalize drizzle-kit')
