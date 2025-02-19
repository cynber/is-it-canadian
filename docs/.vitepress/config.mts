import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Is it Canadian",
  description: "A website to help you determine where a product was made",
  head: [
    ['link', { rel: 'icon', href: '/icon/moose-32.png' }],
    ['meta', { property: 'og:image', content: 'https://isitcanadian.cynber.dev/social_share.png' }]
  ],
  cleanUrls: true,
  vite: { 
    ssr: { noExternal: ['@cynber/vitepress-valence']} 
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Product Search', link: '/product-search' },
      { text: 'About', link: '/guide/' },
      { text: 'Community', link: '/community' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Credits', link: '/guide/credits' }
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cynber/is-it-canadian' }
    ]
  }
})
