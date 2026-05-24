import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Original paintings and fine-art prints by Laura Beckart.',
  images: [
    {
      url: '/favicon.jpg',
    },
  ],
  siteName: 'laurabeckart',
  title: 'laurabeckart',
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
