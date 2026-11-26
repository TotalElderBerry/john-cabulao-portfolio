import { z } from 'zod'

export const TRADES = ['plastering', 'painting', 'carpentry', 'tiling', 'masonry'] as const
export type Trade = (typeof TRADES)[number]

const pct = z.number().min(0).max(100)

const rectFields = { x: pct, y: pct, w: pct.gt(0), h: pct.gt(0) }
const insideSheet = (r: { x: number; y: number; w: number; h: number }) => r.x + r.w <= 100 && r.y + r.h <= 100

export const rectSchema = z.object(rectFields).refine(insideSheet, { message: 'Rect extends beyond the sheet' })
export type Rect = z.infer<typeof rectSchema>

/** A redaction rect on one original PDF page (1-based, default 1). */
export const redactRectSchema = z
  .object({ ...rectFields, page: z.number().int().min(1).default(1) })
  .refine(insideSheet, { message: 'Rect extends beyond the sheet' })
export type RedactRect = z.infer<typeof redactRectSchema>

export const legendItemSchema = z.object({
  label: z.string(),
  qty: z.number(),
  unit: z.string(),
  color: z.string(),
})
export type LegendItem = z.infer<typeof legendItemSchema>

export const boqLineSchema = z.object({
  ref: z.string(),
  description: z.string(),
  qty: z.number(),
  unit: z.string(),
  note: z.string().optional(),
  /** Published sheet index (1-based, after the job's `pages` allow-list is applied), not the PDF page number. */
  sheet: z.number().int().min(1),
  hotspot: rectSchema,
})
export type BoqLine = z.infer<typeof boqLineSchema>

const toolSchema = z.enum(['PlanSwift', 'Cubit', 'CostX'])

export const jobSchema = z
  .object({
    trade: z.enum(TRADES),
    job: z.number().int(),
    public: z.boolean().default(false),
    flagship: z.boolean().default(false),
    projectType: z.string().optional(),
    tool: toolSchema,
    scope: z.string().optional(),
    redact: z.array(redactRectSchema).default([]),
    // Original PDF pages to publish, in order (default: all). Published pages are renumbered 1..k.
    pages: z.array(z.number().int().min(1)).min(1).optional(),
    legend: z.array(legendItemSchema).default([]),
    boq: z.array(boqLineSchema).default([]),
    boqDownload: z.boolean().default(false),
  })
  .refine((j) => !j.flagship || j.boq.length >= 1, {
    message: 'A flagship job requires at least one BoQ line',
    path: ['boq'],
  })
export type Job = z.infer<typeof jobSchema>

export const projectSchema = z.object({
  slug: z.string(),
  public: z.boolean().default(false),
  title: z.string(),
  type: z.string(),
  tool: toolSchema,
  trades: z.array(z.string()),
  blurb: z.string().optional(),
  hero: z.string(),
  slider: z.object({ render: z.string(), takeoff: z.string() }),
  gallery: z.array(z.object({ file: z.string(), caption: z.string() })),
  trim: z.record(z.string(), rectSchema).default({}),
})
export type Project = z.infer<typeof projectSchema>

export const siteSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  statement: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  location: z.string(),
  software: z.array(z.string()),
  credentials: z.array(z.string()),
  services: z.array(
    z.object({ title: z.string(), send: z.string(), get: z.string(), example: z.string().optional() }),
  ),
  experience: z
    .array(z.object({ role: z.string(), org: z.string(), period: z.string(), points: z.array(z.string()).default([]) }))
    .default([]),
  education: z
    .array(z.object({ degree: z.string(), school: z.string(), period: z.string() }))
    .default([]),
  formSuccess: z.string().default('Thanks — John will reply within one working day.'),
})
export type Site = z.infer<typeof siteSchema>
