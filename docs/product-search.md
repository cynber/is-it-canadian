---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Is it Canadian"
  # text: ""
  tagline: Using the Open Food Facts database, we can help you check if a product is Canadian and find alternatives if needed!
  image: /icon/moose-home.png
  actions:
    # - theme: brand
    #   text: Search for a product
    #   link: /product-search
    - theme: brand
      text: How you can help
      link: /guide/#contribute
    - theme: alt
      text: Fund Development 🍁
      link: https://www.ko-fi.com/cynber

head:
  - - meta
    - property: og:locale
      content: en_CA
  - - meta
    - property: og:title
      content: Is it Canadian?
  - - meta
    - property: og:url
      content: https://isitcanadian.cynber.dev
  - - meta
    - property: og:description
      content: Using the Open Food Facts database, we can help you check if a product is Canadian and find alternatives
---

<br>

# Try it out:

You can search for a product and click 'Find Canadian Alternatives' to get a list of products made or sourced from Canada.


<SearchAndRecommend />