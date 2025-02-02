<template>
  <VerticalContainer>
    <HeaderCard title="Search for a product" />
    <BarcodeEntry @product-fetched="onProductFetched" />
    <ProductOrigin
      v-if="searchAttempted"
      :product="product"
      @find-alternatives="onFindAlternatives"
    />
  </VerticalContainer>
</template>

<script>
import { HeaderCard, VerticalContainer } from "@cynber/vitepress-valence";
import BarcodeEntry from "./BarcodeEntry.vue";
import ProductOrigin from "./ProductOrigin.vue";

export default {
  name: "Search",
  components: {
    HeaderCard,
    VerticalContainer,
    BarcodeEntry,
    ProductOrigin,
  },
  data() {
    return {
      product: null,
      searchAttempted: false,
    };
  },
  methods: {
    onProductFetched(product) {
      this.searchAttempted = true;
      this.product = product;
    },
    onFindAlternatives(product) {
      this.$emit("find-alternatives", product);
    },
  },
};
</script>
