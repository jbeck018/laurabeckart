import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import React from 'react'

interface Props {
  menu: Footer['navItems']
}

export function FooterMenu({ menu }: Props) {
  if (!menu?.length) return null

  return (
    <nav>
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {menu.map((item) => {
          return (
            <li key={item.id}>
              <CMSLink
                appearance="link"
                {...item.link}
                className="lowercase tracking-wide text-sm hover:text-foreground transition-colors"
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
