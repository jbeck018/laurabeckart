import type { Media, Product, ThreeItemGridBlock as ThreeItemGridBlockProps } from '@/payload-types'

import { GridTileImage } from '@/components/Grid/tile'
import Link from 'next/link'
import React from 'react'
import type { DefaultDocumentIDType } from 'payload'

type GridItem = {
  href?: null | string
  label?: { amount: number; position?: 'bottom' | 'center'; title: string } | null
  media: Media | null
  size: 'full' | 'half'
}

const productToGridItem = (item: Product, size: 'full' | 'half'): GridItem => ({
  href: `/products/${item.slug}`,
  label: null,
  media: (item.meta?.image as Media) ?? null,
  size,
})

const mediaToGridItem = (item: Media, size: 'full' | 'half'): GridItem => ({
  href: null,
  label: null,
  media: item,
  size,
})

const ThreeItemGridItem: React.FC<{ item: GridItem }> = ({ item }) => {
  const tile = <GridTileImage label={item.label ?? undefined} media={item.media} />

  return (
    <div
      className={
        item.size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'
      }
    >
      {item.href ? (
        <Link className="relative block aspect-square h-full w-full" href={item.href}>
          {tile}
        </Link>
      ) : (
        <div className="relative block aspect-square h-full w-full">{tile}</div>
      )}
    </div>
  )
}

export const ThreeItemGridBlock: React.FC<
  ThreeItemGridBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = ({ contentType, mediaItems, products }) => {
  const sizes: Array<'full' | 'half'> = ['full', 'half', 'half']

  let items: GridItem[] = []

  if (contentType === 'media') {
    const populated = (mediaItems ?? []).filter(
      (item): item is Media => typeof item === 'object' && item !== null,
    )
    items = populated.slice(0, 3).map((item, i) => mediaToGridItem(item, sizes[i]))
  } else {
    const populated = (products ?? []).filter(
      (item): item is Product => typeof item === 'object' && item !== null,
    )
    items = populated.slice(0, 3).map((item, i) => productToGridItem(item, sizes[i]))
  }

  if (items.length < 3) return null

  return (
    <section className="container grid gap-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      {items.map((item, i) => (
        <ThreeItemGridItem item={item} key={i} />
      ))}
    </section>
  )
}
