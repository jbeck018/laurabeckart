export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Caveat, Permanent_Marker, Sacramento } from 'next/font/google'
import React from 'react'
import './globals.css'

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  variable: '--font-permanent-marker',
  weight: '400',
  display: 'swap',
})

const sacramento = Sacramento({
  subsets: ['latin'],
  variable: '--font-sacramento',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  description: 'Original paintings and fine-art prints by Laura Beckart.',
  icons: [{ rel: 'icon', type: 'image/jpeg', url: '/favicon.jpg' }],
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: 'laurabeckart',
    template: '%s | laurabeckart',
  },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[
        GeistSans.variable,
        GeistMono.variable,
        caveat.variable,
        permanentMarker.variable,
        sacramento.variable,
      ]
        .filter(Boolean)
        .join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.jpg" rel="icon" type="image/jpeg" />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />

          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
