import { Categories } from '@/components/layout/search/Categories'
import React, { Suspense } from 'react'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <div className="container flex flex-col gap-8 my-16 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-wide">shop</h1>
          <Categories />
        </div>
        <div className="min-h-screen w-full">{children}</div>
      </div>
    </Suspense>
  )
}
