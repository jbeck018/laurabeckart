import { getCloudflareContext } from '@opennextjs/cloudflare'

type Args = {
  params: Promise<{
    filename: string
  }>
}

type BucketLike = {
  get: (key: string) => Promise<{
    body?: ReadableStream | null
    httpEtag?: string
    writeHttpMetadata: (headers: Headers) => void
  } | null>
}

export async function GET(req: Request, { params }: Args) {
  const { filename } = await params
  const decodedFilename = decodeURIComponent(filename)

  if (!decodedFilename) {
    return Response.json({ error: 'Missing filename' }, { status: 400 })
  }

  const { env } = await getCloudflareContext({ async: true })
  const bucket = (env as { R2?: BucketLike }).R2

  if (!bucket) {
    return Response.redirect(
      new URL(`/api/media/file/${encodeURIComponent(decodedFilename)}`, req.url),
      307,
    )
  }

  const object = await bucket.get(decodedFilename)

  if (!object || !object.body) {
    return Response.json({ error: 'File not found' }, { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)

  if (object.httpEtag) {
    headers.set('etag', object.httpEtag)
  }

  if (headers.get('Content-Type') === 'image/svg+xml') {
    headers.set('Content-Security-Policy', "script-src 'none'")
  }

  return new Response(object.body, { headers })
}
