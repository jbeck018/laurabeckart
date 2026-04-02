'use client'

import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/cn'
import { getMediaURL } from '@/utilities/getMediaURL'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

import { cssVariables } from '@/cssVariables'

const { breakpoints } = cssVariables

export const Image: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    height: heightFromProps,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    width: widthFromProps,
  } = props

  let width: number | undefined | null
  let height: number | undefined | null
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      filename: fullFilename,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource

    width = widthFromProps ?? fullWidth
    height = heightFromProps ?? fullHeight
    alt = altFromResource

    src = getMediaURL({ filename: fullFilename, url })
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value}px`)
        .join(', ')

  if (!src) return null

  if (typeof src === 'string') {
    return (
      <img
        alt={alt || ''}
        className={cn(imgClassName, fill && 'absolute inset-0 h-full w-full')}
        height={!fill ? height || heightFromProps || undefined : undefined}
        onClick={onClick}
        onLoad={() => {
          if (typeof onLoadFromProps === 'function') {
            onLoadFromProps()
          }
        }}
        src={src}
        width={!fill ? width || widthFromProps || undefined : undefined}
      />
    )
  }

  return (
    <NextImage
      alt={alt || ''}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? height || heightFromProps : undefined}
      onClick={onClick}
      onLoad={() => {
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps()
        }
      }}
      priority={priority}
      quality={90}
      sizes={sizes}
      src={src}
      width={!fill ? width || widthFromProps : undefined}
    />
  )
}
