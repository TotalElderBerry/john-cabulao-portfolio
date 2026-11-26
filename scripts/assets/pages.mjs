/** Rects (without `page`) that apply to one original PDF page (1-based); a rect without `page` is page 1. */
export function rectsForPage(redact, page) {
  return (redact ?? []).filter((r) => (r.page ?? 1) === page).map(({ page: _p, ...rect }) => rect)
}

/**
 * Which original pages to publish and the sequential output number of each.
 * `allow` is an optional list of 1-based original page numbers (default: all, in order).
 */
export function publishPlan(total, allow) {
  const src = allow ?? Array.from({ length: total }, (_, i) => i + 1)
  const seen = new Set()
  for (const p of src) {
    if (!Number.isInteger(p) || p < 1 || p > total) throw new Error(`Page ${p} is outside 1..${total}`)
    if (seen.has(p)) throw new Error(`Page ${p} is listed twice`)
    seen.add(p)
  }
  return src.map((source, i) => ({ source, out: i + 1 }))
}
