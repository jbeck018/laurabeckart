import type { Product, Variant } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import { Media } from '@/components/Media'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, title, inventory } = product

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  const isSoldOut = typeof inventory === 'number' && inventory <= 0

  return (
    <Link className="relative inline-block h-full w-full group" href={`/products/${product.slug}`}>
      {image ? (
        <div className="relative">
          <Media
            className="relative aspect-[4/5] object-cover"
            height={80}
            imgClassName="h-full w-full object-cover transition duration-300 ease-in-out group-hover:opacity-90"
            resource={image}
            width={80}
          />
          {isSoldOut && (
            <span className="absolute top-3 left-3 text-xs uppercase tracking-widest text-muted-foreground bg-background/80 px-2 py-1">
              Sold out
            </span>
          )}
        </div>
      ) : null}

      <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors mt-3">
        <div className="lowercase">{title}</div>
      </div>
    </Link>
  )
}
