// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import '@cynber/vitepress-valence/style.css'

import authors from './data/authors.js'
import { data as postsData } from './data/posts.data.js'

import { 
  BlogPostHeader,
  BlogPostList,
} from '@cynber/vitepress-valence';  

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('BlogPostHeader', BlogPostHeader)
    app.component('BlogPostList', BlogPostList)
    app.provide('authors', authors)
    app.provide('postsData', postsData)
  }
} satisfies Theme
