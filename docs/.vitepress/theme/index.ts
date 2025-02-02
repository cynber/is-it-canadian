// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import '@cynber/vitepress-valence/style.css'

import authors from './data/authors.js'
import { data as postsData } from './data/posts.data.js'

import SearchAndRecommend from './components/SearchAndRecommend.vue'

import { 
  BlogPostHeader,
  BlogPostList,
  HeaderCard,
  VerticalContainer,
  HorizontalContainer,
  VerticalCard,
  HorizontalCard,
  EmbedLemmy
} from '@cynber/vitepress-valence';  

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('SearchAndRecommend', SearchAndRecommend)
    app.component('BlogPostHeader', BlogPostHeader)
    app.component('BlogPostList', BlogPostList)
    app.component('HeaderCard', HeaderCard)
    app.component('VerticalContainer', VerticalContainer)
    app.component('HorizontalContainer', HorizontalContainer)
    app.component('VerticalCard', VerticalCard)
    app.component('HorizontalCard', HorizontalCard)
    app.component('EmbedLemmy', EmbedLemmy)
    app.provide('authors', authors)
    app.provide('postsData', postsData)
  }
} satisfies Theme
