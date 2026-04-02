import type { Media, Product, CarouselBlock as CarouselBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { DefaultDocumentIDType, getPayload } from 'payload'
import React from 'react'

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
  const { id, categories, limit = 3, populateBy, selectedDocs } = props

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

  const carouselProducts = products.map((product) => ({
    image: getCarouselImage(product),
    priceInUSD: product.priceInUSD ?? null,
    slug: product.slug ?? '',
    title: product.title,
  }))

  return (
    <div className=" w-full pb-6 pt-1">
      <CarouselClient products={carouselProducts} />
    </div>
  )
}
