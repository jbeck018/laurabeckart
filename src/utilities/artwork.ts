import type { Product, Variant, VariantOption } from '@/payload-types'

const inStock = (inventory?: null | number): boolean =>
  typeof inventory === 'number' && inventory > 0

const variantIsOriginal = (variant: Variant): boolean =>
  Array.isArray(variant.options) &&
  variant.options.some(
    (option): option is VariantOption =>
      typeof option === 'object' && option !== null && option.value === 'original',
  )

/** The one-of-a-kind "Original" variant of a product, if it has one. */
export const getOriginalVariant = (product: Product): undefined | Variant => {
  const docs = product.variants?.docs
  if (!docs?.length) return undefined
  return docs.find(
    (variant): variant is Variant =>
      typeof variant === 'object' && variant !== null && variantIsOriginal(variant),
  )
}

/** True when there is still something purchasable (e.g. prints) on this product. */
export const hasPurchasableOption = (product: Product): boolean => {
  if (product.enableVariants && product.variants?.docs?.length) {
    return product.variants.docs.some(
      (variant) => typeof variant === 'object' && variant !== null && inStock(variant.inventory),
    )
  }
  return inStock(product.inventory)
}

/**
 * True when this product's original is sold out. Always false for non-originals.
 * - With variants: checks the "Original" variant's inventory; if the product is
 *   flagged original but has no explicit original variant, it's "sold" only when
 *   nothing at all is in stock.
 * - Without variants: checks product inventory.
 */
export const isOriginalSold = (product: Product): boolean => {
  if (!product.isOriginal) return false

  if (product.enableVariants && product.variants?.docs?.length) {
    const original = getOriginalVariant(product)
    if (original) return !inStock(original.inventory)
    return !hasPurchasableOption(product)
  }

  return !inStock(product.inventory)
}
