<template>
  <div class="product-origin">
    <img :src="product.image_url" alt="Product Image" class="product-image" />
    <div class="product-info">
      <h3>{{ product.product_name }}</h3>
      <p>Brands: {{ product.brands }}</p>
      <p>Quantity: {{ product.quantity }}</p>
      <div class="origin-pill" :class="isCanadian ? 'green' : 'gray'">
        Origin: {{ originsDisplay }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductOrigin",
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    isCanadian() {
      return (Array.isArray(this.product.origins) && this.product.origins.includes('Canada')) || this.product.origins === 'Canada';
    },
    originsDisplay() {
      return Array.isArray(this.product.origins) ? this.product.origins.join(', ') : this.product.origins || 'Unknown';
    }
  }
}
</script>

<style scoped>
.product-origin {
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  width: calc(100% + 16px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-image {
  width: 80%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 16px;
}

.product-info {
  text-align: center;
}

.product-info h3 {
  margin: 0 0 8px 0;
}

.origin-pill {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 8px;
}

.origin-pill.green {
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}

.origin-pill.gray {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}
</style>