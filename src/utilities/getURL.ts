import { canUseDOM } from './canUseDOM'

const isUsableURL = (value?: string | null): value is string =>
  Boolean(value && value !== 'undefined' && value !== 'null')

export const getServerSideURL = (): string => {
  const url = process.env.NEXT_PUBLIC_SERVER_URL

  if (!isUsableURL(url) && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (isUsableURL(url)) {
    return url
  }

  return 'http://localhost:3000'
}

export const getClientSideURL = (): string => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return isUsableURL(process.env.NEXT_PUBLIC_SERVER_URL) ? process.env.NEXT_PUBLIC_SERVER_URL : ''
}
