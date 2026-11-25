import { readFile } from 'node:fs/promises'
import * as mupdf from 'mupdf'

/** Cap on rendered pixels per page; above this the width is reduced. */
export const MAX_PIXELS = 60_000_000

/**
 * Render each page of a PDF to a PNG, widthPx wide (reduced if the result would exceed MAX_PIXELS).
 * Returns Buffer[]; `.capped` on the array lists pages (1-based) whose width was capped.
 */
export async function renderPdfPages(pdfPath, widthPx) {
  const doc = mupdf.Document.openDocument(await readFile(pdfPath), 'application/pdf')
  const out = []
  out.capped = []
  try {
    const n = doc.countPages()
    for (let i = 0; i < n; i++) {
      const page = doc.loadPage(i)
      const [x0, y0, x1, y1] = page.getBounds()
      const pw = x1 - x0
      const ph = y1 - y0
      let w = widthPx
      if (w * (w * (ph / pw)) > MAX_PIXELS) {
        w = Math.floor(Math.sqrt(MAX_PIXELS / (ph / pw)))
        out.capped.push({ page: i + 1, width: w })
      }
      const s = w / pw
      const pix = page.toPixmap(mupdf.Matrix.scale(s, s), mupdf.ColorSpace.DeviceRGB, false)
      out.push(Buffer.from(pix.asPNG()))
      pix.destroy()
      page.destroy()
    }
  } finally {
    doc.destroy()
  }
  return out
}
