import type { SerializedTextNode } from '@payloadcms/richtext-lexical'
import { TextStateFeature } from '@payloadcms/richtext-lexical'
import type { CSSProperties } from 'react'

const hyphenatedPropertyToCamelCase = (property: string): string =>
  property.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())

export const richTextTextStates = {
  typeface: {
    serif: {
      label: 'Serif',
      css: {
        'font-family': 'var(--font-serif)',
      },
    },
    mono: {
      label: 'Mono',
      css: {
        'font-family': 'var(--font-mono)',
        'font-size': '0.94em',
        'letter-spacing': '0.06em',
        'text-transform': 'uppercase',
      },
    },
    handwriting: {
      label: 'Handwriting',
      css: {
        'font-family': 'var(--font-caveat), var(--font-sans)',
        'font-size': '1.2em',
        'font-weight': '500',
        'letter-spacing': '0.015em',
      },
    },
    script: {
      label: 'Cursive',
      css: {
        'font-family': 'var(--font-sacramento), cursive',
        'font-size': '1.7em',
        'line-height': '1.05',
      },
    },
    marker: {
      label: 'Marker',
      css: {
        'font-family': 'var(--font-permanent-marker), cursive',
        'font-size': '1.02em',
        'letter-spacing': '0.03em',
      },
    },
  },
} as const

export const richTextTextStateFeature = TextStateFeature({
  state: richTextTextStates,
})

type SerializedTextNodeWithState = SerializedTextNode & {
  $?: Record<string, unknown>
  style?: string
}

const cssToReactStyle = (css: Record<string, string | undefined>): CSSProperties => {
  const style: CSSProperties = {}

  Object.entries(css).forEach(([property, value]) => {
    if (!value) return

    ;(style as Record<string, string | number>)[hyphenatedPropertyToCamelCase(property)] = value
  })

  return style
}

const parseInlineStyle = (styleValue?: string): CSSProperties => {
  if (!styleValue) return {}

  return styleValue.split(';').reduce<CSSProperties>((style, declaration) => {
    const [property, value] = declaration.split(':')

    if (!property || !value) return style

    ;(style as Record<string, string | number>)[hyphenatedPropertyToCamelCase(property.trim())] =
      value.trim()

    return style
  }, {})
}

export const getRichTextTextStyles = (node: SerializedTextNode): CSSProperties => {
  const serializedNode = node as SerializedTextNodeWithState
  const state = serializedNode.$

  const textStateStyles =
    state && typeof state === 'object'
      ? Object.entries(richTextTextStates).reduce<CSSProperties>((style, [stateKey, values]) => {
          const selectedValue = state[stateKey]

          if (typeof selectedValue !== 'string') return style

          const value = values[selectedValue as keyof typeof values]

          if (!value) return style

          return {
            ...style,
            ...cssToReactStyle(value.css),
          }
        }, {})
      : {}

  return {
    ...parseInlineStyle(serializedNode.style),
    ...textStateStyles,
  }
}
