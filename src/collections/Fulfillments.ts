import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * One record per purchasable item (an original or a print of a given size) that
 * needs to be fulfilled. Auto-created from the Orders `afterChange` hook so the
 * admin can track each piece through new → in progress → completed in the panel.
 * The admin email notification is a pointer to these records, not the source of truth.
 */
export const Fulfillments: CollectionConfig = {
  slug: 'fulfillments',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  admin: {
    defaultColumns: ['title', 'type', 'size', 'status', 'customerEmail', 'createdAt'],
    group: 'Shop',
    listSearchableFields: ['title', 'customerEmail', 'size'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Auto-generated summary of the item.',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      options: [
        { label: 'Original', value: 'original' },
        { label: 'Print', value: 'print' },
      ],
    },
    {
      name: 'size',
      type: 'text',
      admin: {
        description: 'Selected print size (prints only).',
        readOnly: true,
      },
    },
    {
      name: 'quantity',
      type: 'number',
      admin: {
        readOnly: true,
      },
      defaultValue: 1,
    },
    {
      name: 'product',
      type: 'relationship',
      admin: {
        readOnly: true,
      },
      relationTo: 'products',
    },
    {
      name: 'variant',
      type: 'relationship',
      admin: {
        readOnly: true,
      },
      relationTo: 'variants',
    },
    {
      name: 'order',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      relationTo: 'orders',
    },
    {
      name: 'customerEmail',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes (shipping, framing, tracking, etc.).',
      },
    },
  ],
}
