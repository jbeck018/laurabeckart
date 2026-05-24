import type { Payload } from 'payload'

type AdminEmailArgs = {
  html: string
  subject: string
  text?: string
}

/**
 * Provider-agnostic admin email sender.
 *
 * Uses an HTTP email API (Resend by default) so it works on the Cloudflare
 * Workers runtime, where SMTP/nodemailer cannot open TCP sockets. If the
 * required env vars are absent it no-ops and logs, so the rest of the app keeps
 * working until a key is provided.
 *
 * Env:
 *   RESEND_API_KEY  - API key for the email provider
 *   ADMIN_EMAIL     - recipient (comma-separated for multiple)
 *   EMAIL_FROM      - verified sender address (defaults to orders@laurabeckart.com)
 *
 * To swap providers, change the endpoint/headers/body below; the call sites
 * don't need to change.
 */
export async function sendAdminEmail(
  { html, subject, text }: AdminEmailArgs,
  payload?: Payload,
): Promise<{ error?: string; sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ADMIN_EMAIL
  const from = process.env.EMAIL_FROM || 'orders@laurabeckart.com'

  const log = (level: 'error' | 'info', message: string) => {
    if (payload) payload.logger[level](message)
    else console[level === 'error' ? 'error' : 'log'](message)
  }

  if (!apiKey || !to) {
    log(
      'info',
      `[admin-email] Skipped (set RESEND_API_KEY and ADMIN_EMAIL to enable). Subject: "${subject}"`,
    )
    return { sent: false }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      body: JSON.stringify({
        from,
        html,
        subject,
        text: text ?? undefined,
        to: to.split(',').map((address) => address.trim()),
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      const body = await response.text()
      log('error', `[admin-email] Provider returned ${response.status}: ${body}`)
      return { error: `HTTP ${response.status}`, sent: false }
    }

    return { sent: true }
  } catch (error) {
    log('error', `[admin-email] Failed to send: ${error instanceof Error ? error.message : error}`)
    return { error: 'request failed', sent: false }
  }
}
