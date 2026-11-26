type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v)

/**
 * Nuxt Content stores data-collection objects with dotted keys split into nested objects, so the
 * `trim` record key "3D - Structural.PNG" comes back as { "3D - Structural": { PNG: rect } }.
 * Re-join those keys (a rect is the first object that has an `x`) before the row is parsed.
 */
export function projectRow<T extends Obj>(row: T): T {
  if (!isObj(row.trim)) return row
  const trim: Obj = {}
  const walk = (o: Obj, prefix: string) => {
    for (const [k, v] of Object.entries(o)) {
      const key = prefix ? `${prefix}.${k}` : k
      if (isObj(v) && !('x' in v)) walk(v, key)
      else trim[key] = v
    }
  }
  walk(row.trim, '')
  return { ...row, trim }
}
