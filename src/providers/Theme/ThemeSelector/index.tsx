'use client'

import { cn } from '@/utilities/cn'
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
    label: string
    value: Theme | 'auto'
  }> = [
    {
      label: 'auto',
      value: 'auto',
    },
    {
      label: 'light',
      value: 'light',
    },
    {
      label: 'dark',
      value: 'dark',
    },
  ]

  return (
    <div className="inline-flex items-center gap-2 text-xs lowercase tracking-wide text-muted-foreground">
      {options.map((option, index) => {
        const isActive = value === option.value

        return (
          <React.Fragment key={option.value}>
            {index > 0 ? <span aria-hidden="true" className="text-border">/</span> : null}
            <button
              aria-label={`Switch theme to ${option.label}`}
              className={cn(
                'cursor-pointer transition-colors hover:text-foreground',
                isActive && 'text-foreground underline underline-offset-4',
              )}
              onClick={() => onThemeChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          </React.Fragment>
        )
      })}
    </div>
  )
}
