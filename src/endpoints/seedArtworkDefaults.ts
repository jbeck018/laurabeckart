import type { Endpoint, Payload, PayloadRequest } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Default "Format" options for artwork products. The `original` option marks the
 * one-of-a-kind piece (set its variant inventory to 1); the rest are made-to-order
 * print sizes (set a price per size). Edit/extend these per product in the admin.
 */
export const FORMAT_OPTIONS = [
  { label: 'Original', value: 'original' },
  { label: 'Print — 8×10"', value: 'print-8x10' },
  { label: 'Print — 11×14"', value: 'print-11x14' },
  { label: 'Print — 16×20"', value: 'print-16x20' },
  { label: 'Print — 24×36"', value: 'print-24x36' },
] as const

/**
 * Idempotent: creates the `format` variant type and its default options if they
 * don't already exist. Safe to run multiple times.
 */
export async function seedArtworkDefaults(payload: Payload, req?: PayloadRequest) {
  const existingType = await payload.find({
    collection: 'variantTypes',
    depth: 0,
    limit: 1,
    req,
    where: { name: { equals: 'format' } },
  })

  const formatType =
    existingType.docs[0] ??
    (await payload.create({
      collection: 'variantTypes',
      data: { name: 'format', label: 'Format' },
      req,
    }))

  const created: string[] = []

  for (const option of FORMAT_OPTIONS) {
    const found = await payload.find({
      collection: 'variantOptions',
      depth: 0,
      limit: 1,
      req,
      where: {
        and: [{ variantType: { equals: formatType.id } }, { value: { equals: option.value } }],
      },
    })

    if (!found.docs.length) {
      await payload.create({
        collection: 'variantOptions',
        data: { ...option, variantType: formatType.id },
        req,
      })
      created.push(option.value)
    }
  }

  return { created, formatTypeID: formatType.id }
}

/**
 * Admin-only endpoint: POST /api/seed-artwork-defaults
 * Creates the default Format variant type + print-size options.
 */
export const seedArtworkDefaultsEndpoint: Endpoint = {
  handler: async (req) => {
    if (!req.user || !checkRole(['admin'], req.user)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await seedArtworkDefaults(req.payload, req)

    return Response.json({ ok: true, ...result })
  },
  method: 'post',
  path: '/seed-artwork-defaults',
}
