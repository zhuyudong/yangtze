import moonlightTheme from '../assets/moonlight-ii.json' with { type: 'json' }

// https://rehype-pretty.pages.dev/
/** @type {import('rehype-pretty-code').Options} */
export const rehypePrettyCodeOptions = {
  keepBackground: false,
  theme: moonlightTheme
  // ...
}
