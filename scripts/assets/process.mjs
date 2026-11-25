import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { pctToPx } from './geometry.mjs'

const png = (s) => s.png({ compressionLevel: 1 }).toBuffer()

/** White-fill each % rect; same dimensions out. */
export async function redact(img, rects) {
  if (!rects.length) return img
  const { width, height } = await sharp(img).metadata()
  const overlays = await Promise.all(
    rects.map(async (r) => {
      const p = pctToPx(r, width, height)
      const input = await sharp({
        create: { width: p.width, height: p.height, channels: 3, background: '#ffffff' },
      })
        .png()
        .toBuffer()
      return { input, left: p.left, top: p.top }
    }),
  )
  return png(sharp(img).composite(overlays))
}

/** Crop to a % rect. */
export async function trim(img, r) {
  const { width, height } = await sharp(img).metadata()
  return png(sharp(img).extract(pctToPx(r, width, height)))
}

/**
 * Write <base>-<w>.webp and <base>-<w>.jpg for each width (never upscaling).
 * Returns the aspect ratio (w/h) of the source.
 */
export async function writeSizes(img, base, widths) {
  const { width, height } = await sharp(img).metadata()
  await mkdir(path.dirname(base), { recursive: true })
  for (const w of widths) {
    const target = Math.min(w, width)
    const resized = () => sharp(img).resize({ width: target, withoutEnlargement: true })
    await writeFile(`${base}-${w}.webp`, await resized().webp({ quality: 78 }).toBuffer())
    await writeFile(`${base}-${w}.jpg`, await resized().flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }).toBuffer())
  }
  return Math.round((width / height) * 10000) / 10000
}
