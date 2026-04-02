'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import logo from '@/assets/laura-logo.jpg'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import type { Header } from 'src/payload-types'

import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80">
      <nav className="flex items-center justify-between container py-3">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <div className="flex w-full items-center justify-between">
          <Link className="shrink-0" href="/">
            <Image
              alt="Laura Beck Art"
              className="h-12 w-12 rounded-full object-cover ring-1 ring-border/70 md:h-14 md:w-14"
              priority
              sizes="56px"
              src={logo}
            />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {menu.length ? (
              <ul className="flex gap-6 text-sm items-center">
                {menu.map((item) => (
                  <li key={item.id}>
                    <CMSLink
                      {...item.link}
                      size={'clear'}
                      className={cn('relative navLink lowercase tracking-wide', {
                        active:
                          item.link.url && item.link.url !== '/'
                            ? pathname.includes(item.link.url)
                            : false,
                      })}
                      appearance="nav"
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>

          <div className="flex md:hidden">
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>
        </div>
      </nav>
    </div>
  )
}
