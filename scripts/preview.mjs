// Static server for .output/public on :4173 (PREVIEW_ROOT and PORT override). Unknown paths get 404.html with status 404.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize, resolve } from 'node:path'
import { brotliCompressSync, gzipSync, constants } from 'node:zlib'

const root = resolve(process.cwd(), process.env.PREVIEW_ROOT || '.output/public')
const port = Number(process.env.PORT || 4173)
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf',
}

async function find(p) {
  const base = join(root, normalize(p))
  if (!base.startsWith(root)) return null
  for (const f of [base, join(base, 'index.html'), base + '.html']) {
    try { if ((await stat(f)).isFile()) return f } catch {}
  }
  return null
}

createServer(async (req, res) => {
  let path
  try { path = decodeURIComponent(new URL(req.url, 'http://x').pathname) }
  catch { res.writeHead(400).end('Bad request'); return }
  let file = await find(path)
  let status = 200
  if (!file) { file = await find('/404.html'); status = 404 }
  if (!file) { res.writeHead(404).end('Not found'); return }
  let body = await readFile(file)
  const type = types[extname(file)] || 'application/octet-stream'
  const headers = { 'content-type': type }
  // Compress text like the production host (Vercel) does, so Lighthouse measures realistic transfer sizes.
  if (/^(text\/|application\/(json|xml)|image\/svg)/.test(type)) {
    const accept = String(req.headers['accept-encoding'] || '')
    headers.vary = 'accept-encoding'
    if (/\bbr\b/.test(accept)) {
      body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } })
      headers['content-encoding'] = 'br'
    } else if (/\bgzip\b/.test(accept)) {
      body = gzipSync(body)
      headers['content-encoding'] = 'gzip'
    }
  }
  res.writeHead(status, headers).end(body)
}).listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`))
