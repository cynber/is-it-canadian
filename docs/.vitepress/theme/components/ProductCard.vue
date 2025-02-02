<template>
  <div class="product-card">
    <div class="product-image" v-if="product.image_url">
      <img :src="product.image_url" :alt="product.name" />
    </div>
    <div class="product-info">
      <div class="product-header">
        <strong>{{ product.brand }}</strong
        >: {{ product.name }}
      </div>
      <div class="origin-info">
        <strong>Ingredients: </strong>
        <span :class="{ 'missing-data': product.origins === 'Origin not specified' }">
          {{ product.origins }}
        </span>
      </div>
      <div class="manufacturing-info">
        <strong>Manufacturing: </strong>
        <span
          :class="{
            'missing-data':
              product.manufacturing_places === 'Manufacturing location not specified',
          }"
        >
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
  padding: 20px;
  margin: 10px;
  display: flex;
  gap: 20px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-header {
  font-size: 1.2em;
  margin-bottom: 15px;
}

.origin-info,
.manufacturing-info {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin: 10px 0 0;
}

.missing-data {
  color: var(--vp-c-text-3);
  font-style: italic;
}
</style>
