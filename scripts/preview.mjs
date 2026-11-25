// Static server for .output/public on :4173. Unknown paths get 404.html with status 404.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const root = join(process.cwd(), '.output/public')
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
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  let file = await find(path)
  let status = 200
  if (!file) { file = await find('/404.html'); status = 404 }
  if (!file) { res.writeHead(404).end('Not found'); return }
  const body = await readFile(file)
  res.writeHead(status, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(body)
}).listen(port, () => console.log(`Serving .output/public on http://localhost:${port}`))
