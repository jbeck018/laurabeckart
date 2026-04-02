'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { Laptop2, Moon, Sun } from 'lucide-react'
import React, { useState } from 'react'

import type { Theme } from '../types'

import { useTheme } from '..'
import { themeLocalStorageKey } from '../shared'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: Theme | 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  const options: Array<{
    icon: typeof Sun
    label: string
    value: Theme | 'auto'
  }> = [
    {
      icon: Laptop2,
      label: 'Auto',
      value: 'auto',
    },
    {
      icon: Sun,
      label: 'Light',
      value: 'light',
    },
    {
      icon: Moon,
      label: 'Dark',
      value: 'dark',
    },
  ]

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background/80 p-1 backdrop-blur-sm">
      {options.map((option) => {
        const Icon = option.icon
        const isActive = value === option.value

        return (
          <Button
            key={option.value}
            aria-label={`Switch theme to ${option.label}`}
            className={cn(
              'h-9 rounded-full px-3 text-primary/60 transition-colors hover:text-primary',
              isActive && 'bg-primary text-primary-foreground hover:text-primary-foreground',
            )}
            onClick={() => onThemeChange(option.value)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Icon className="h-4 w-4" />
            <span className="ml-2 hidden md:inline">{option.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
