---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Is it Canadian"
  # text: ""
  tagline: Using the Open Food Facts database, we can help you check if a product is Canadian and find alternatives
  image: /icon/moose-home.png
  actions:
    - theme: brand
      text: Search for a product
      link: /product-search
    - theme: alt
      text: How you can help
      link: /guide/#contribute

# features:
#   - title: Feature A
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
#   - title: Feature B
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
#   - title: Feature C
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---

<br><br><br>

## What we've done so far

<br>

<HorizontalContainer>
    <HorizontalCard
      title="Search by barcode"
      excerpt="Our tool lets you search for a product by barcode, and then lets you know about where the ingredients were sourced and where the product was made. You can then run a search for Canadian alternatives. Best of all, you can contribute to the Open Food Facts database to make this even easier for others!"
      image="/demo-search-and-recommend.png"
      url="./product-search"
      :hideCategory="true"
      :hideAuthor="true"
      titleLines="5"
      excerptLines="5"
    />
  </HorizontalContainer>
