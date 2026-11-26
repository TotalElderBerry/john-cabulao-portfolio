/** Loupe placement from the mockup: background is the sheet at `zoom`×, offset so the pointer sits at the loupe centre. */
export function loupeStyle(
  rect: { width: number; height: number },
  x: number,
  y: number,
  zoom: number,
  size: number,
): { left: string; top: string; backgroundSize: string; backgroundPosition: string } {
  const half = size / 2
  return {
    left: `${x}px`,
    top: `${y}px`,
    backgroundSize: `${rect.width * zoom}px ${rect.height * zoom}px`,
    backgroundPosition: `${-(x * zoom - half)}px ${-(y * zoom - half)}px`,
  }
}
