/** Convert a percentage rect to integer pixels, clamped inside the image. */
export function pctToPx(r, width, height) {
  const left = Math.min(width - 1, Math.max(0, Math.round((r.x / 100) * width)))
  const top = Math.min(height - 1, Math.max(0, Math.round((r.y / 100) * height)))
  const w = Math.max(1, Math.min(width - left, Math.round((r.w / 100) * width)))
  const h = Math.max(1, Math.min(height - top, Math.round((r.h / 100) * height)))
  return { left, top, width: w, height: h }
}
