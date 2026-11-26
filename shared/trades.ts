// Kept free of zod so pages can import it without pulling the schema library into the client bundle.
export const TRADES = ['plastering', 'painting', 'carpentry', 'tiling', 'masonry'] as const
export type Trade = (typeof TRADES)[number]
