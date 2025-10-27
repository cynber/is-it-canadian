<template>
  <VpvContainerVertical
    headerTitle="Search for a product"
  >
    <BarcodeInput @product-fetched="onProductFetched" />
    <ProductCardOrigin
      v-if="searchAttempted"
      :product="product"
      @find-alternatives="onFindAlternatives"
    />
  </VpvContainerVertical>
</template>

<script>
import { VpvContainerVertical } from "@cynber/vitepress-valence";
import BarcodeInput from "./search/BarcodeInput.vue";
import ProductCardOrigin from "./card/ProductCardOrigin.vue";

export default {
  name: "Search",
  components: {
    VpvContainerVertical,
    BarcodeInput,
    ProductCardOrigin,
  },
  data() {
    return {
      product: null,
      searchAttempted: false,
    };
  },
  methods: {
    onProductFetched(product) {
      if (product === null) {
        this.searchAttempted = false;
        this.product = null;
      } else {
        this.searchAttempted = true;
        this.product = product;
      }
    },
    onFindAlternatives(product) {
      this.$emit("find-alternatives", product);
    },
  },
};
</script>
