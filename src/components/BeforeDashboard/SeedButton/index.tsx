'use client'

import React, { Fragment, useCallback, useState, MouseEvent } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{' '}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Database already seeded.')
        return
      }
      if (loading) {
        toast.info('Seeding already in progress.')
        return
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`)
        return
      }

      setLoading(true)

      try {
        const seedPromise = fetch('/next/seed', { method: 'POST', credentials: 'include' }).then(
          async (res) => {
            if (res.ok) {
              return true
            }

            const body = await res
              .json()
              .catch((): { error?: string } | null => null)

            throw new Error(body?.error || `Seeding failed with status ${res.status}.`)
          },
        )

        toast.promise(seedPromise, {
          loading: 'Seeding with data....',
          success: <SuccessMessage />,
          error: (err) =>
            err instanceof Error ? err.message : 'An error occurred while seeding.',
        })

        await seedPromise
        setSeeded(true)
        setError(null)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
    </Fragment>
  )
}
