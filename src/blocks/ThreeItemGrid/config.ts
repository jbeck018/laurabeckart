import type { Block } from 'payload'

export const ThreeItemGrid: Block = {
  slug: 'threeItemGrid',
  fields: [
    {
      name: 'contentType',
      type: 'select',
      defaultValue: 'products',
      label: 'Content Type',
      options: [
        {
          label: 'Products',
          value: 'products',
        },
        {
          label: 'Media',
          value: 'media',
        },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.contentType === 'products',
        isSortable: true,
      },
      hasMany: true,
      label: 'Products to show',
      maxRows: 3,
      minRows: 3,
      relationTo: 'products',
    },
    {
      name: 'mediaItems',
      type: 'upload',
      admin: {
        condition: (_, siblingData) => siblingData.contentType === 'media',
        isSortable: true,
      },
      hasMany: true,
      label: 'Images to show',
      maxRows: 3,
      minRows: 3,
      relationTo: 'media',
    },
  ],
  interfaceName: 'ThreeItemGridBlock',
  labels: {
    plural: 'Three Item Grids',
    singular: 'Three Item Grid',
  },
}
