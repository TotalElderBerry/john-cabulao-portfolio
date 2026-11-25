import type { Rect } from './schemas'

export function zoomToRect(
  r: Rect,
  pad = 1.25,
  maxScale = 4,
): { scale: number; tx: number; ty: number; box: Rect } {
  const scale = Math.min(100 / (r.w * pad), 100 / (r.h * pad), maxScale)
  const tx = 50 - (r.x + r.w / 2) * scale
  const ty = 50 - (r.y + r.h / 2) * scale
  return { scale, tx, ty, box: { x: tx + r.x * scale, y: ty + r.y * scale, w: r.w * scale, h: r.h * scale } }
}
