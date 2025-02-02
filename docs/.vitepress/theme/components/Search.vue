<template>
  <VerticalContainer>
    <HeaderCard title="Search for a product" />
    <BarcodeEntry @product-fetched="onProductFetched" />
    <ProductOrigin v-if="product" :product="product" />
  </VerticalContainer>
</template>

<script>
import { HeaderCard, VerticalContainer } from '@cynber/vitepress-valence';
import BarcodeEntry from './BarcodeEntry.vue';
import ProductOrigin from './ProductOrigin.vue';

export default {
  name: 'Search',
  components: {
    HeaderCard,
    VerticalContainer,
    BarcodeEntry,
    ProductOrigin
  },
  data() {
    return {
      product: null
    };
  },
  methods: {
    onProductFetched(product) {
      this.product = product;
    }
  }
}
</script>