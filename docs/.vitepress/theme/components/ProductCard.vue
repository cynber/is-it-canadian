<template>
  <div class="product-card">
    <p>{{ product.name }}</p>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.product-card {
  border: 1px solid var(--vp-c-divider);
  padding: 10px;
  margin: 5px;
}
</style>
