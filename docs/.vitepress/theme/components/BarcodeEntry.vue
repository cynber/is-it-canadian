<template>
  <div class="barcode-entry">
    <input
      type="text"
      class="barcode-input"
      placeholder="Enter a barcode"
      v-model="barcode"
      @input="onInput"
    />
    <button class="barcode-button" @click="searchProduct">Search</button>
  </div>
</template>

<script>
export default {
  name: "BarcodeEntry",
  data() {
    return {
      barcode: "",
      loading: false,
      error: null,
    };
  },
  methods: {
    onInput(event) {
      //
    },
    async searchProduct() {
      if (!this.barcode.trim()) {
        this.error = "Please enter a barcode.";
        console.error("Please enter a barcode.");
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${this.barcode}.json`,
          {
            headers: {
              "User-Agent": "YourAppName/1.0 (your.email@example.com)",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 1 && data.product) {
          const product = data.product;
          console.log("Product information:", product);
          this.$emit("product-fetched", product);
        } else {
          this.error = "No product found with this barcode.";
          console.error("No product found with this barcode.");
          this.$emit("product-fetched", null);
        }
      } catch (err) {
        this.error = "An error occurred while fetching data.";
        console.error("An error occurred while fetching data:", err);
        this.$emit("product-fetched", null);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.barcode-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  margin: -8px -8px 0px -8px;
  width: calc(100% + 16px);
  box-sizing: border-box;
}

.barcode-input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  margin-right: 8px;
  font-size: 1rem;
}

.barcode-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  border: 1px solid var(--vp-button-brand-border);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.barcode-button:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
  border: 1px solid var(--vp-button-brand-hover-border);
}

.barcode-button:active {
  color: var(--vp-button-brand-active-text);
  background-color: var(--vp-button-brand-active-bg);
  border: 1px solid var(--vp-button-brand-active-border);
}
</style>
