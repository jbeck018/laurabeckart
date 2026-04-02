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
