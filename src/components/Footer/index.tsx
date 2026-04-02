import type { Footer } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React, { Suspense } from 'react'
import { Instagram, Mail } from 'lucide-react'

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const menu = footer.navItems || []
  const currentYear = new Date().getFullYear()

  return (
    <footer className="text-sm text-muted-foreground mt-auto">
      <div className="container">
        <div className="border-t border-border py-12">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Social Icons */}
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/laura.beck.art/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:laura.grace08@gmail.com"
                className="hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            {/* Navigation */}
            <Suspense fallback={null}>
              <FooterMenu menu={menu} />
            </Suspense>

            {/* Contact Info */}
            <div className="flex flex-col items-center gap-1 text-xs tracking-wide">
              <p>&copy; {currentYear} Laura Beck Art</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
