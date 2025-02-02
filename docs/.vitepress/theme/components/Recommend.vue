<template>
  <HorizontalContainer>
    <HeaderCard
      title="First search for a product"
      :centered="true"
      v-if="!showAlternatives"
    />
    <template v-else>
      <HeaderCard title="See alternative products" :showRefreshIcon="true" />
      <ProductCard
        v-for="product in alternativeProducts"
        :key="product.id"
        :product="product"
      />
    </template>
  </HorizontalContainer>
</template>

<script>
import { HeaderCard, HorizontalContainer } from "@cynber/vitepress-valence";
import ProductCard from "./ProductCard.vue";

export default {
  name: "Recommend",
  components: {
    HorizontalContainer,
    HeaderCard,
    ProductCard,
  },
  data() {
    return {
      showAlternatives: false,
      alternativeProducts: [],
    };
  },
  methods: {
    loadAlternatives() {
      this.alternativeProducts = [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
        { id: 3, name: "Product 3" },
      ];
      this.showAlternatives = true;
    },
  },
};
</script>