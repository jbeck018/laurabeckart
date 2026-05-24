import type { Media, Product, CarouselBlock as CarouselBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { DefaultDocumentIDType, getPayload } from 'payload'
import React from 'react'

import type { CarouselItemData } from './Component.client'

import { CarouselClient } from './Component.client'

const getCarouselImage = (product: Product): Media | null => {
  if (typeof product.meta?.image === 'object' && product.meta.image !== null) {
    return product.meta.image as Media
  }

  const firstGalleryImage = product.gallery?.[0]?.image

  if (typeof firstGalleryImage === 'object' && firstGalleryImage !== null) {
    return firstGalleryImage as Media
  }

  return null
}

export const CarouselBlock: React.FC<
  CarouselBlockProps & {
    id?: DefaultDocumentIDType
  }
> = async (props) => {
  const { id, categories, contentType, limit = 3, media, populateBy, selectedDocs } = props

  // Media mode: render uploaded images directly, no products required.
  if (contentType === 'media') {
    const items: CarouselItemData[] = (media ?? [])
      .map((item, index): CarouselItemData | null => {
        if (typeof item !== 'object' || item === null) return null
        return {
          href: null,
          image: item,
          key: `${item.id}-${index}`,
          label: null,
        }
      })
      .filter((item): item is CarouselItemData => item !== null)

    if (!items.length) return null

    return (
      <div className=" w-full pb-6 pt-1">
        <CarouselClient items={items} />
      </div>
    )
  }

  const payload = await getPayload({ config: configPromise })
  let products: Product[] = []

  if (populateBy === 'collection') {
    const flattenedCategories = categories?.length
      ? categories.map((category) => {
          if (typeof category === 'object') return category.id
          else return category
        })
      : null

    const fetchedProducts = await payload.find({
      collection: 'products',
      depth: 2,
      limit: limit || undefined,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    products = fetchedProducts.docs
  } else if (selectedDocs?.length) {
    const selectedProductIDs = selectedDocs
      .map((post) => {
        if (typeof post.value === 'object' && post.value !== null) return post.value.id
        return post.value
      })
      .filter((value): value is DefaultDocumentIDType => Boolean(value))

    if (selectedProductIDs.length) {
      const fetchedProducts = await payload.find({
        collection: 'products',
        depth: 2,
        limit: selectedProductIDs.length,
        pagination: false,
        where: {
          id: {
            in: selectedProductIDs,
          },
        },
      })

      const productMap = new Map(fetchedProducts.docs.map((product) => [product.id, product]))
      products = selectedProductIDs
        .map((productID) => productMap.get(productID))
        .filter((product): product is Product => Boolean(product))
    }
  }

  if (!products?.length) return null

  const items: CarouselItemData[] = products.map((product) => ({
    href: `/products/${product.slug ?? ''}`,
    image: getCarouselImage(product),
    key: product.slug ?? String(product.id),
    label: null,
  }))

  return (
    <div className=" w-full pb-6 pt-1">
      <CarouselClient items={items} />
    </div>
  )
}
