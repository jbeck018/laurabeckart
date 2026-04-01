declare namespace Cloudflare {
  interface Env {
    D1: D1Database
    ASSETS: Fetcher
  }
}
interface CloudflareEnv extends Cloudflare.Env {}
