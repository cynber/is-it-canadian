<template>
  <div class="product-origin">
    <div v-if="product && product.brands && product.product_name">
      <div class="product-image-container" v-if="product.image_url">
        <img
          :src="product.image_url"
          alt="Product Image"
          class="product-image"
          @load="handleImageLoad"
          ref="productImage"
        />
      </div>
      <div class="product-info">
        <div class="product-header">
          <strong>{{ product.brands }}:</strong> {{ product.product_name }}
        </div>
        <div class="location-section">
          <div class="location-info">
            <strong>Origin(s) of ingredients:</strong>
            <div class="info-content">
              <template
                v-if="formattedOrigins[0] === 'This information has not been entered.'"
              >
                This info has not been entered,
                <a href="/guide/#add-product-information">you can submit it</a>.
              </template>
              <div v-else class="location-pills">
                <div
                  v-for="origin in formattedOrigins"
                  :key="origin"
                  class="pill"
                  :class="origin.toLowerCase().includes('canada') ? 'green' : 'gray'"
                >
                  {{ formatLocation(origin) }}
                </div>
              </div>
            </div>
          </div>
          <div class="location-info">
            <strong>Manufacturing / Processing:</strong>
            <div class="info-content">
              <template
                v-if="
                  formattedManufacturingPlaces[0] ===
                  'This information has not been entered.'
                "
              >
                This info has not been entered,
                <a href="/guide/#add-product-information">you can submit it</a>.
              </template>
              <div v-else class="location-pills">
                <div
                  v-for="place in formattedManufacturingPlaces"
                  :key="place"
                  class="pill"
                  :class="place.toLowerCase().includes('canada') ? 'green' : 'gray'"
                >
                  {{ formatLocation(place) }}
                </div>
              </div>
            </div>
          </div>
          <div class="location-info">
            <strong>Places where it is sold:</strong>
            <div class="info-content">
              <template
                v-if="
                  formattedPurchasePlaces[0] === 'This information has not been entered.'
                "
              >
                This info has not been entered,
                <a href="/guide/#add-product-information">you can submit it</a>.
              </template>
              <div v-else class="location-pills">
                <div
                  v-for="place in formattedPurchasePlaces"
                  :key="place"
                  class="pill"
                  :class="place.toLowerCase().includes('canada') ? 'green' : 'gray'"
                >
                  {{ formatLocation(place) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="product-not-found">
      This product is not listed in the database. <br />
      Check the barcode again, or
      <a href="/guide/#add-product-information">contribute by submitting it</a> 💛
    </div>
    <div class="find-alternatives" v-if="product && product.brands">
      <button class="find-alternatives-button" @click="findCanadianAlternatives">
        Find Canadian Alternatives
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCardOrigin",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatLocation(location) {
      return location.split(":").pop().trim().toUpperCase();
    },
    handleImageLoad(event) {
      const img = event.target;
      if (img.naturalWidth > img.naturalHeight) {
        img.classList.add("landscape");
      } else {
        img.classList.add("portrait");
        img.classList.add("rotate");
      }
    },
    findCanadianAlternatives() {
      this.$emit("find-alternatives", this.product);
    },
  },
  computed: {
    formattedOrigins() {
      if (Array.isArray(this.product.origins)) {
        return this.product.origins;
      }
      if (this.product.origins && typeof this.product.origins === "string") {
        return this.product.origins.split(",").map((s) => s.trim());
      }
      return ["This information has not been entered."];
    },
    formattedManufacturingPlaces() {
      if (Array.isArray(this.product.manufacturing_places_tags)) {
        return this.product.manufacturing_places_tags;
      }
      if (
        this.product.manufacturing_places &&
        typeof this.product.manufacturing_places === "string"
      ) {
        return this.product.manufacturing_places.split(",").map((s) => s.trim());
      }
      return ["This information has not been entered."];
    },
    formattedPurchasePlaces() {
      if (Array.isArray(this.product.purchase_places_tags)) {
        return this.product.purchase_places_tags;
      }
      if (this.product.countries && typeof this.product.countries === "string") {
        return this.product.countries.split(",").map((s) => s.trim());
      }
      return ["This information has not been entered."];
    },
  },
};
</script>

<style scoped>
.product-origin {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: -16px auto 0;
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.product-image-container {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.product-image.landscape {
  width: 100%;
  height: auto;
}

.product-image.portrait.rotate {
  transform: rotate(-90deg) scale(1.5);
  width: 200px;
  height: auto;
}

.product-info {
  width: 100%;
}

.product-header {
  font-size: 1.2em;
  margin-bottom: 15px;
  width: 100%;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 15px;
}

.location-section {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.location-info {
  margin-bottom: 15px;
}

.info-content {
  margin: 10px 20px;
}

.location-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9em;
}

.green {
  background-color: var(--vp-c-red-3);
  color: var(--vp-button-brand-text);
}

.gray {
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.product-not-found {
  text-align: center;
  color: var(--vp-c-text-2);
}

a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.info-content:not(.location-pills) {
  color: var(--vp-c-text-2);
}

.find-alternatives {
  margin-top: 20px;
  text-align: center;
}

.find-alternatives-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  border: 1px solid var(--vp-button-brand-border);
  font-size: 1rem;
  cursor: pointer;
}
</style>
