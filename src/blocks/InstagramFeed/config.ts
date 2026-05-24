import type { Block } from 'payload'

export const InstagramFeed: Block = {
  slug: 'instagramFeed',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Instagram',
      label: 'Heading',
    },
    {
      name: 'username',
      type: 'text',
      admin: {
        description: 'Handle without the @. Used for the "Follow" link.',
      },
      label: 'Instagram username',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        description: 'How many posts to show (max 24).',
        step: 1,
      },
      defaultValue: 8,
      max: 24,
      min: 1,
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      label: 'Columns',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '6', value: '6' },
      ],
    },
    {
      name: 'fallbackPosts',
      type: 'array',
      admin: {
        description:
          'Shown when the Instagram access token is not configured (or the API is unavailable). Curate posts manually here.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional link to the Instagram post.',
          },
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
      label: 'Fallback posts',
      maxRows: 24,
    },
  ],
  interfaceName: 'InstagramFeedBlock',
  labels: {
    plural: 'Instagram Feeds',
    singular: 'Instagram Feed',
  },
}
