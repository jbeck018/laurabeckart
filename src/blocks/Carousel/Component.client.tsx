'use client'
import type { Media } from '@/payload-types'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import Link from 'next/link'
import React from 'react'
import { GridTileImage } from '@/components/Grid/tile'

export type CarouselItemData = {
  href?: null | string
  image: Media | null
  key: string
  label?: { amount: number; title: string } | null
}

export const CarouselClient: React.FC<{ items: CarouselItemData[] }> = ({ items }) => {
  if (!items?.length) return null

  // Purposefully duplicating items to make the carousel loop and not run out of items on wide screens.
  const carouselItems = [...items, ...items, ...items]

  return (
    <Carousel
      className="w-full"
      opts={{ align: 'start', loop: true }}
      plugins={[
        AutoScroll({
          playOnInit: true,
          speed: 1,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {carouselItems.map((item, i) => {
          const tile = <GridTileImage label={item.label ?? undefined} media={item.image} />

          return (
            <CarouselItem
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
              key={`${item.key}${i}`}
            >
              {item.href ? (
                <Link className="relative h-full w-full" href={item.href}>
                  {tile}
                </Link>
              ) : (
                <div className="relative h-full w-full">{tile}</div>
              )}
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}
