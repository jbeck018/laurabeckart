import { cn } from '@/utilities/cn'
import React from 'react'

export const SoldBadge: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground',
      className,
    )}
  >
    Sold
  </span>
)
