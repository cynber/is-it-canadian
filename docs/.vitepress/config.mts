import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Is it Canadian",
  description: "Using the Open Food Facts database, we can help you check if a product is Canadian and find alternatives if needed",
  head: [
    ["link", { rel: "icon", href: "/icon/moose-32.png" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://isitcanadian.cynber.dev/social_share.png",
      },
    ],
  ],
  cleanUrls: true,
  vite: {
    ssr: { noExternal: ["@cynber/vitepress-valence"] },
  },
  rewrites: {
    'product-search.md': 'index.md'
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Product Search', link: '/product-search' },
      { text: "About", link: "/guide/" },
      { text: "My Other Projects", link: "https://cynber.dev" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Getting Started", link: "/guide/" },
            { text: "Community", link: "/guide/community" },
          ],
        },
      ],
    },
    footer: {
      message:
        'If this project has helped you, would you consider funding future development by <a href="https://ko-fi.com/cynber">buying me a cookie</a>? Thank you! 🍪 ❤️ <br><br> Created and maintained by <a href="https://github.com/cynber">@cynber</a>. Find my other projects at <a href="https://cynber.dev">cynber.dev</a>.',
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/cynber/is-it-canadian" },
    ],
  },
});
