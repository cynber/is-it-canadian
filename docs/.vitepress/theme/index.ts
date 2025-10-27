// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import '@cynber/vitepress-valence/style.css'

import { Icon } from '@iconify/vue'
import { 
  VpvContainerHorizontal,
  VpvContainerVertical,
  VpvCardHorizontal,
  VpvCardVertical,
  VpvEmbedLemmy
} from '@cynber/vitepress-valence';

import SearchAndRecommend from './components/SearchAndRecommend.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // Imported
    app.component('Icon', Icon)
    app.component('VpvContainerHorizontal', VpvContainerHorizontal)
    app.component('VpvContainerVertical', VpvContainerVertical)
    app.component('VpvCardHorizontal', VpvCardHorizontal)
    app.component('VpvCardVertical', VpvCardVertical)
    app.component('VpvEmbedLemmy', VpvEmbedLemmy)

    // Custom
    app.component('SearchAndRecommend', SearchAndRecommend)
  }
} satisfies Theme
