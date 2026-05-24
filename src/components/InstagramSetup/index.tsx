import { Banner } from '@payloadcms/ui'
import React from 'react'

/**
 * Renders the Instagram feed setup instructions directly in the admin dashboard
 * (registered via admin.components.beforeDashboard). Mirrors docs/INSTAGRAM_SETUP.md.
 */
export const InstagramSetup: React.FC = () => {
  const linkProps = { rel: 'noopener noreferrer', target: '_blank' as const }

  return (
    <div style={{ marginTop: '1rem' }}>
      <Banner type="info">
        <strong>Instagram feed setup</strong> — connect a live feed, or curate posts manually.
      </Banner>

      <details style={{ marginTop: '0.5rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
          Show steps to connect a live Instagram feed
        </summary>

        <div style={{ fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.75rem' }}>
          <p>
            The <strong>Instagram Feed</strong> block (add it to any page&apos;s layout) shows your
            latest posts. It works in two modes:
          </p>
          <ul>
            <li>
              <strong>Live</strong> — set the <code>INSTAGRAM_ACCESS_TOKEN</code> environment
              variable (steps below).
            </li>
            <li>
              <strong>Manual</strong> — no token needed; fill in the block&apos;s{' '}
              <em>Fallback posts</em> (image + link) and they&apos;ll be shown instead.
            </li>
          </ul>

          <p>
            <strong>To connect the live feed:</strong>
          </p>
          <ol>
            <li>
              In the Instagram app, switch the account to a <strong>Professional</strong> account
              (Settings → Account type and tools → Switch to professional account).
            </li>
            <li>
              Create a Meta app at{' '}
              <a href="https://developers.facebook.com/apps" {...linkProps}>
                developers.facebook.com/apps
              </a>{' '}
              → <em>Create app</em> → <em>Other</em> → <em>Business</em>.
            </li>
            <li>
              Add the <strong>Instagram</strong> product → <em>API setup with Instagram login</em>,
              add your account as an Instagram tester and accept the invite in the IG app.
            </li>
            <li>
              <strong>Generate a long-lived access token</strong> (scope{' '}
              <code>instagram_business_basic</code>) and copy it.
            </li>
            <li>
              Set <code>INSTAGRAM_ACCESS_TOKEN</code> in your environment (Cloudflare project vars +
              local <code>.env</code>), then redeploy / restart the server.
            </li>
            <li>
              Add the <strong>Instagram Feed</strong> block to a page, set the username / number of
              posts / columns, and publish.
            </li>
          </ol>

          <p>
            <strong>Keep it alive:</strong> long-lived tokens expire after ~60 days. Refresh before
            then by visiting{' '}
            <code>
              https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&amp;access_token=YOUR_TOKEN
            </code>{' '}
            and pasting the new token back into <code>INSTAGRAM_ACCESS_TOKEN</code>.
          </p>

          <p>
            Full instructions live in <code>docs/INSTAGRAM_SETUP.md</code> in the repo.
          </p>
        </div>
      </details>
    </div>
  )
}
