// Loads the Manrope stylesheet from Google Fonts without blocking first paint (the media="print" swap),
// with a <noscript> fallback. Text paints in the system fallback first, then swaps (display=swap).
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500&display=swap'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:html', (html) => {
    html.head.push(
      `<link rel="stylesheet" href="${FONT_CSS}" media="print" onload="this.media='all'">`,
      `<noscript><link rel="stylesheet" href="${FONT_CSS}"></noscript>`,
    )
  })
})
