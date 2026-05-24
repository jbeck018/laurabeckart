export type InstagramMedia = {
  caption?: string
  id: string
  mediaType: 'CAROUSEL_ALBUM' | 'IMAGE' | 'VIDEO'
  mediaUrl: string
  permalink: string
  thumbnailUrl?: string
  timestamp?: string
}

type RawMedia = {
  caption?: string
  id: string
  media_type?: string
  media_url?: string
  permalink?: string
  thumbnail_url?: string
  timestamp?: string
}

/**
 * Fetches recent media from the Instagram Graph API (graph.instagram.com) using a
 * long-lived access token from INSTAGRAM_ACCESS_TOKEN. Works on the Cloudflare
 * Workers runtime (plain fetch). Returns [] if no token is set or the request
 * fails, so callers can fall back to manually-curated posts.
 *
 * Responses are cached for an hour via Next's fetch cache.
 */
export async function fetchInstagramMedia(limit = 8): Promise<InstagramMedia[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) return []

  const safeLimit = Math.min(Math.max(limit, 1), 24)
  const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${safeLimit}&access_token=${encodeURIComponent(
    token,
  )}`

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } })

    if (!response.ok) {
      const body = await response.text()
      console.error(`[instagram] Graph API returned ${response.status}: ${body}`)
      return []
    }

    const json = (await response.json()) as { data?: RawMedia[] }
    const data = Array.isArray(json?.data) ? json.data : []

    return data
      .filter((item): item is RawMedia & { media_url: string; permalink: string } =>
        Boolean(item?.media_url && item?.permalink),
      )
      .slice(0, safeLimit)
      .map((item) => ({
        id: item.id,
        caption: item.caption,
        mediaType: (item.media_type as InstagramMedia['mediaType']) ?? 'IMAGE',
        mediaUrl: item.media_url,
        permalink: item.permalink,
        thumbnailUrl: item.thumbnail_url,
        timestamp: item.timestamp,
      }))
  } catch (error) {
    console.error(
      `[instagram] Failed to fetch media: ${error instanceof Error ? error.message : error}`,
    )
    return []
  }
}
