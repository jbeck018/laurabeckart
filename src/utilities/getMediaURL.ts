import { getServerSideURL } from './getURL'

type MediaLike = {
  filename?: string | null
  url?: string | null
}

export const getMediaURL = (media?: MediaLike | null): string => {
  if (!media) return ''

  const { filename, url } = media

  const encodedFilename = filename ? encodeURIComponent(filename) : ''

  if (url) {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      if (url.startsWith('/api/media/file/') && encodedFilename) {
        return `/api/r2-media/${encodedFilename}`
      }

      return url
    }

    return `/${url}`
  }

  if (filename) {
    return `/api/r2-media/${encodedFilename}`
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
