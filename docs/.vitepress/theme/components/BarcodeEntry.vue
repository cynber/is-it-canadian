<template>
  <!-- Barcode entry form -->
  <div class="input-group">
    <button class="scan-btn" @click="toggleCamera">
      <Icon icon="material-symbols:barcode-scanner-rounded" width="24" height="24" />
      <span class="scan-btn__tooltip">Scan with camera</span>
    </button>

    <input
      type="text"
      class="text-input"
      placeholder="Enter a barcode"
      v-model="barcode"
      @input="onInput"
    />

    <button class="search-btn" @click="searchProduct">Search</button>
  </div>

  <!-- Camera scanner (hidden by default) -->
  <div v-if="showCamera" class="camera">
    <button class="camera-close" @click="toggleCamera">✕ Close Camera</button>
    <StreamBarcodeReader
      @decode="onDecode"
      @loaded="onLoaded"
      :paused="!showCamera"
      :constraints="{
        facingMode: 'environment',
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
      }"
    ></StreamBarcodeReader>
  </div>

  <!-- Confirmation Modal (hidden by default) -->
  <div v-if="showConfirmation" class="modal">
    <div class="modal-content">
      <h3>Barcode Detected</h3>
      <p>Found barcode: {{ barcode }}</p>
      <div class="modal-buttons">
        <button class="modal-confirm" @click="confirmSearch">Search This Product</button>
        <button class="modal-cancel" @click="resumeScanning">Resume Scanning</button>
      </div>
    </div>
  </div>

  <!-- Image upload scanner -->
  <div class="upload">
    <ImageBarcodeReader @decode="onDecode" @error="onError"></ImageBarcodeReader>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  name: "BarcodeEntry",
  emits: ["product-fetched"],
  data() {
    return {
      barcode: "",
      loading: false,
      error: null,
      showCamera: false,
      showConfirmation: false,
    };
  },
  methods: {
    toggleCamera() {
      this.showCamera = !this.showCamera;
      this.showConfirmation = false;
      if (!this.showCamera) {
        this.stopCamera();
      }
    },
    stopCamera() {
      const videoElements = document.getElementsByTagName("video");
      for (let video of videoElements) {
        if (video.srcObject) {
          const tracks = video.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
          video.srcObject = null;
        }
      }
    },
    onInput(event) {
      // Handle input changes if needed
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
    onDecode(result) {
      console.log("Decoded result:", result);
      if (result && result.text) {
        this.barcode = result.text;
        // Close camera and clean up
        this.showCamera = false;
        this.stopCamera();
        // Focus the search button
        this.$nextTick(() => {
          const searchButton = document.querySelector(".btn-text-search");
          if (searchButton) {
            searchButton.focus();
          }
        });
      } else {
        console.error("No barcode detected.");
      }
    },
    confirmSearch() {
      this.showConfirmation = false;
      this.stopCamera();
      this.searchProduct();
    },
    resumeScanning() {
      this.showConfirmation = false;
      this.showCamera = true;
    },
    onLoaded() {
      console.log("Scanner is loaded and ready");
    },
    onError(error) {
      console.error("Error decoding:", error);
    },
  },
};
</script>

<style scoped>
/* Layout Components */
.input-group {
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
  gap: 8px;
}

.camera {
  position: relative;
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.upload {
  margin-top: 16px;
}

/* Input Elements */
.text-input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 1rem;
}

/* Buttons */
.scan-btn {
  padding: 8px;
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border: 1px solid var(--vp-button-brand-border);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  font-size: 1.2rem;
}

.scan-btn__tooltip {
  visibility: hidden;
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 1;
}

.scan-btn:hover .scan-btn__tooltip {
  visibility: visible;
}

.search-btn {
  padding: 8px 16px;
  border-radius: 4px;
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  border: 1px solid var(--vp-button-brand-border);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.search-btn:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
  border: 1px solid var(--vp-button-brand-hover-border);
}

.search-btn:active {
  color: var(--vp-button-brand-active-text);
  background-color: var(--vp-button-brand-active-bg);
  border: 1px solid var(--vp-button-brand-active-border);
}

.camera-close {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 16px;
  background-color: var(--vp-c-danger);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--vp-c-bg);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 400px;
  text-align: center;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.modal-confirm {
  padding: 8px 16px;
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border: 1px solid var(--vp-button-brand-border);
  border-radius: 4px;
  cursor: pointer;
}

.modal-cancel {
  padding: 8px 16px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
}
</style>
