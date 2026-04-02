import { getServerSideURL } from './getURL'

type MediaLike = {
  filename?: string | null
  url?: string | null
}

export const getMediaURL = (media?: MediaLike | null): string => {
  if (!media) return ''

  const { filename, url } = media

  if (url) {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url
    }

    return `/${url}`
  }

  if (filename) {
    return `/api/media/file/${filename}`
  }

  return ''
}

export const getAbsoluteMediaURL = (media?: MediaLike | null): string => {
  const mediaURL = getMediaURL(media)

  if (!mediaURL) return ''

  if (mediaURL.startsWith('http://') || mediaURL.startsWith('https://')) {
    return mediaURL
  }

  return `${getServerSideURL()}${mediaURL}`
}
