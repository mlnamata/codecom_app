import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
const port = Number(process.env.PORT || 8081)

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

const jeSoubor = (p) => fs.existsSync(p) && fs.statSync(p).isFile()

/**
 * Najde soubor statického exportu pro cestu tak, jak ho vytváří Expo Router:
 * `deska.html`, `deska/index.html` i dynamické `deska/[id].html`.
 * Vrácení jiné stránky by rozbilo hydrataci (React #418).
 */
function najdiSoubor(pathname) {
  const zaklad = path.join(distDir, pathname)
  // Nikdy nevracej soubor mimo složku exportu.
  if (zaklad !== distDir && !zaklad.startsWith(distDir + path.sep)) {
    return path.join(distDir, '+not-found.html')
  }
  const kandidati = [zaklad, `${zaklad}.html`, path.join(zaklad, 'index.html')]
  for (const k of kandidati) {
    if (jeSoubor(k)) return k
  }
  // Dynamická trasa: ve stejné složce soubor [parametr].html
  const slozka = path.dirname(zaklad)
  if (fs.existsSync(slozka) && fs.statSync(slozka).isDirectory()) {
    const dynamicky = fs.readdirSync(slozka).find((f) => /^\[[^\]]+\]\.html$/.test(f))
    if (dynamicky) return path.join(slozka, dynamicky)
  }
  const nenalezeno = path.join(distDir, '+not-found.html')
  return jeSoubor(nenalezeno) ? nenalezeno : path.join(distDir, 'index.html')
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  let pathname = decodeURIComponent(url.pathname)
  if (pathname.endsWith('/')) {
    pathname += 'index.html'
  }

  const filePath = najdiSoubor(pathname)
  const status = filePath.endsWith('+not-found.html') ? 404 : 200

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('404 Nenalezeno (nejprve spusťte pnpm export:web)')
    return
  }

  const ext = path.extname(filePath).toLowerCase()
  const mime = MIME_TYPES[ext] || 'application/octet-stream'

  res.writeHead(status, {
    'Content-Type': mime,
    'Cache-Control': 'no-cache',
  })
  fs.createReadStream(filePath).pipe(res)
})

server.listen(port, () => {
  console.log(`Statický server běží na http://localhost:${port}`)
})
