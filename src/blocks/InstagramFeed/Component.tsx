import type { DefaultDocumentIDType } from 'payload'

import type { InstagramFeedBlock as InstagramFeedBlockProps, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import { fetchInstagramMedia } from '@/utilities/instagram'
import { InstagramIcon } from 'lucide-react'
import React from 'react'

const columnClasses: Record<string, string> = {
  '2': 'grid-cols-2',
  '3': 'grid-cols-2 sm:grid-cols-3',
  '4': 'grid-cols-2 sm:grid-cols-4',
  '6': 'grid-cols-3 sm:grid-cols-6',
}

export const InstagramFeedBlock: React.FC<
  InstagramFeedBlockProps & {
    id?: DefaultDocumentIDType
  }
> = async (props) => {
  const { columns, fallbackPosts, heading, limit, username } = props

  const media = await fetchInstagramMedia(limit ?? 8)

  const tiles: Array<{
    caption?: null | string
    href?: null | string
    key: string
    media?: MediaType | null
    src?: string
  }> = media.length
    ? media.map((item) => ({
        caption: item.caption,
        href: item.permalink,
        key: item.id,
        src: item.mediaType === 'VIDEO' ? item.thumbnailUrl || item.mediaUrl : item.mediaUrl,
      }))
    : (fallbackPosts ?? [])
        .map((post, index) => ({
          caption: post.caption,
          href: post.link,
          key: post.id ?? String(index),
          media: typeof post.image === 'object' ? (post.image as MediaType) : null,
        }))
        .filter((tile) => tile.media)

  // Nothing to show and no handle to link to — render nothing.
  if (!tiles.length && !username) return null

  const gridCols = columnClasses[columns ?? '4'] ?? columnClasses['4']
  const profileUrl = username ? `https://instagram.com/${username.replace(/^@/, '')}` : null

  return (
    <section className="container my-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-light lowercase tracking-wide">{heading || 'Instagram'}</h2>
        {profileUrl && (
          <a
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lowercase"
            href={profileUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <InstagramIcon className="h-4 w-4" />
            {username?.startsWith('@') ? username : `@${username}`}
          </a>
        )}
      </div>

      {tiles.length > 0 && (
        <div className={cn('grid gap-2 md:gap-4', gridCols)}>
          {tiles.map((tile) => {
            const inner = tile.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={tile.caption?.slice(0, 120) ?? 'Instagram post'}
                className="aspect-square h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
                loading="lazy"
                src={tile.src}
              />
            ) : tile.media ? (
              <Media
                className="h-full w-full"
                imgClassName="aspect-square h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
                resource={tile.media}
              />
            ) : null

            const className =
              'group relative block aspect-square overflow-hidden rounded-lg border border-border bg-muted'

            return tile.href ? (
              <a
                className={className}
                href={tile.href}
                key={tile.key}
                rel="noopener noreferrer"
                target="_blank"
              >
                {inner}
              </a>
            ) : (
              <div className={className} key={tile.key}>
                {inner}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
