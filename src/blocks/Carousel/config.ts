import type { Block } from 'payload'

export const Carousel: Block = {
  slug: 'carousel',
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
      name: 'populateBy',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.contentType === 'products',
      },
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) =>
          siblingData.contentType === 'products' && siblingData.populateBy === 'collection',
      },
      defaultValue: 'products',
      label: 'Collections To Show',
      options: [
        {
          label: 'Products',
          value: 'products',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData.contentType === 'products' && siblingData.populateBy === 'collection',
      },
      hasMany: true,
      label: 'Categories To Show',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) =>
          siblingData.contentType === 'products' && siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
      label: 'Limit',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData.contentType === 'products' && siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: 'Selection',
      relationTo: ['products'],
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, siblingData) => siblingData.contentType === 'media',
        description: 'Images shown in the carousel. Add as many as you like.',
      },
      hasMany: true,
      label: 'Media',
      relationTo: 'media',
    },
    {
      name: 'populatedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData.contentType === 'products' && siblingData.populateBy === 'collection',
        description: 'This field is auto-populated after-read',
        disabled: true,
      },
      hasMany: true,
      label: 'Populated Docs',
      relationTo: ['products'],
    },
    {
      name: 'populatedDocsTotal',
      type: 'number',
      admin: {
        condition: (_, siblingData) =>
          siblingData.contentType === 'products' && siblingData.populateBy === 'collection',
        description: 'This field is auto-populated after-read',
        disabled: true,
        step: 1,
      },
      label: 'Populated Docs Total',
    },
  ],
  interfaceName: 'CarouselBlock',
  labels: {
    plural: 'Carousels',
    singular: 'Carousel',
  },
}
