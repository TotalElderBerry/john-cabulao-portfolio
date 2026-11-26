export interface StatementWord { text: string; hl: boolean }

/** Split a statement into words; words inside `*asterisks*` are highlights (the markers are removed). */
export function splitStatement(s: string): StatementWord[] {
  const out: StatementWord[] = []
  for (const part of s.split(/(\*[^*]+\*)/)) {
    const hl = part.startsWith('*') && part.endsWith('*') && part.length > 1
    const body = hl ? part.slice(1, -1) : part
    for (const text of body.split(/\s+/)) if (text) out.push({ text, hl })
  }
  return out
}
