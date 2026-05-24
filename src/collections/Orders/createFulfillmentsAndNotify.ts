import type { CollectionAfterChangeHook } from 'payload'

import type { Variant, VariantOption } from '@/payload-types'

import { sendAdminEmail } from '@/utilities/sendAdminEmail'

type FulfillmentType = 'original' | 'print'

type Line = {
  productTitle: string
  quantity: number
  size: null | string
  title: string
  type: FulfillmentType
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * On order creation, create a trackable `fulfillments` record for each artwork
 * line item (originals and prints, identified by the product's isOriginal /
 * isPrintable flags) and email the admin a summary. Regular merchandise is
 * ignored. The DB records are the source of truth; the email is a pointer.
 */
export const createFulfillmentsAndNotify: CollectionAfterChangeHook = async ({
  context,
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc
  if (context?.skipFulfillment) return doc

  const { payload } = req
  const items: Array<{ product?: unknown; quantity?: number; variant?: unknown }> = Array.isArray(
    doc?.items,
  )
    ? doc.items
    : []

  if (!items.length) return doc

  const resolveID = (ref: unknown): null | number | string => {
    if (ref && typeof ref === 'object' && 'id' in ref) return (ref as { id: number | string }).id
    if (typeof ref === 'number' || typeof ref === 'string') return ref
    return null
  }

  const lines: Line[] = []

  for (const item of items) {
    const quantity = typeof item?.quantity === 'number' ? item.quantity : 1
    const productID = resolveID(item?.product)
    if (!productID) continue

    let product
    try {
      product = await payload.findByID({ id: productID, collection: 'products', depth: 0, req })
    } catch {
      continue
    }

    const isOriginalFlag = Boolean(product?.isOriginal)
    const isPrintableFlag = Boolean(product?.isPrintable)

    // Only track artwork (originals / prints), not regular merchandise.
    if (!isOriginalFlag && !isPrintableFlag) continue

    const variantID = resolveID(item?.variant)
    let variant: undefined | Variant
    if (variantID) {
      try {
        variant = await payload.findByID({
          id: variantID,
          collection: 'variants',
          depth: 1,
          req,
        })
      } catch {
        variant = undefined
      }
    }

    const populatedOptions: VariantOption[] = Array.isArray(variant?.options)
      ? (variant.options.filter(
          (option) => option && typeof option === 'object',
        ) as VariantOption[])
      : []
    const optionLabels = populatedOptions
      .map((option) => (typeof option.label === 'string' ? option.label : ''))
      .filter(Boolean)
    const isOriginalVariant = populatedOptions.some((option) => option.value === 'original')

    let type: FulfillmentType
    let size: null | string = null

    if (isOriginalVariant) {
      type = 'original'
    } else if (variant) {
      type = 'print'
      size = optionLabels.join(', ') || (typeof variant.title === 'string' ? variant.title : null)
    } else {
      type = isOriginalFlag && !isPrintableFlag ? 'original' : isPrintableFlag ? 'print' : 'original'
    }

    const productTitle = typeof product?.title === 'string' ? product.title : 'Untitled'
    const title =
      type === 'original'
        ? `Original — ${productTitle}`
        : `Print${size ? ` (${size})` : ''} — ${productTitle}`

    lines.push({ productTitle, quantity, size, title, type })

    try {
      await payload.create({
        collection: 'fulfillments',
        context: { skipFulfillment: true },
        data: {
          title,
          customerEmail: typeof doc?.customerEmail === 'string' ? doc.customerEmail : null,
          order: doc.id as number,
          product: productID as number,
          quantity,
          size,
          status: 'new',
          type,
          variant: (variantID ?? null) as null | number,
        },
        overrideAccess: true,
        req,
      })
    } catch (error) {
      payload.logger.error(
        `[fulfillments] Failed to create record for order ${doc?.id}: ${
          error instanceof Error ? error.message : error
        }`,
      )
    }
  }

  if (!lines.length) return doc

  const originals = lines.filter((line) => line.type === 'original')
  const prints = lines.filter((line) => line.type === 'print')

  const renderList = (heading: string, entries: Line[]) =>
    entries.length
      ? `<h3 style="margin:16px 0 4px">${heading}</h3><ul>${entries
          .map(
            (line) =>
              `<li>${escapeHtml(line.productTitle)}${
                line.size ? ` — <strong>${escapeHtml(line.size)}</strong>` : ''
              } × ${line.quantity}</li>`,
          )
          .join('')}</ul>`
      : ''

  const customerEmail = typeof doc?.customerEmail === 'string' ? doc.customerEmail : 'unknown'
  const subject = `New order #${doc?.id} — ${originals.length} original(s), ${prints.length} print(s)`
  const html = `
    <h2>New order #${escapeHtml(String(doc?.id))}</h2>
    <p>Customer: ${escapeHtml(customerEmail)}</p>
    ${renderList('Originals to pull & ship', originals)}
    ${renderList('Prints to produce', prints)}
    <p style="margin-top:16px;color:#666">Track and update each item under <strong>Shop → Fulfillments</strong> in the admin panel.</p>
  `
  const text = [
    `New order #${doc?.id}`,
    `Customer: ${customerEmail}`,
    originals.length
      ? `Originals:\n${originals.map((l) => `  - ${l.productTitle} x${l.quantity}`).join('\n')}`
      : '',
    prints.length
      ? `Prints:\n${prints
          .map((l) => `  - ${l.productTitle}${l.size ? ` (${l.size})` : ''} x${l.quantity}`)
          .join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  await sendAdminEmail({ html, subject, text }, payload)

  return doc
}
