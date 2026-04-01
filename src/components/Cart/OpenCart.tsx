import { Button } from '@/components/ui/button'
import React from 'react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button
      variant="nav"
      size="clear"
      className="relative lowercase tracking-wide text-sm opacity-60 hover:opacity-100 transition-opacity hover:cursor-pointer"
      {...rest}
    >
      <span>cart ({quantity ?? 0})</span>
    </Button>
  )
}
