<template>
  <div class="product-card">
    <div class="product-image" v-if="product.image_url">
      <img :src="product.image_url" :alt="product.name">
    </div>
    <div class="product-info">
      <h3>{{ product.brand }}: {{ product.name }}</h3>
      <div class="origin-info">
        <strong>Origins:</strong> 
        <span :class="{ 'missing-data': product.origins === 'Origin not specified' }">
          {{ product.origins }}
        </span>
      </div>
      <div class="manufacturing-info">
        <strong>Manufacturing:</strong> 
        <span :class="{ 'missing-data': product.manufacturing_places === 'Manufacturing location not specified' }">
          {{ product.manufacturing_places }}
        </span>
      </div>
    </div>
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
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  display: flex;
  gap: 15px;
  background-color: var(--vp-c-bg-soft);
}

.product-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.origin-info,
.manufacturing-info {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin: 5px 0;
}

.missing-data {
  color: var(--vp-c-text-3);
  font-style: italic;
}
</style>
