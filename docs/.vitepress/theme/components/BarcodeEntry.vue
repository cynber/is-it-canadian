<template>
  <div class="barcode-entry">
    <!-- First row -->
    <div class="input-group__row">
      <button
        class="entry-btn scan-btn"
        :class="{ 'scan-btn--active': barcode }"
        @click="toggleCamera"
      >
        <Icon icon="material-symbols:barcode-scanner-rounded" width="24" height="24" />
        Scan a code
      </button>

      <label class="entry-btn upload-btn">
        <Icon icon="material-symbols:image" width="24" height="24" />
        Upload Image
        <ImageBarcodeReader
          class="hidden-upload"
          @decode="onDecode"
          @error="onError"
        ></ImageBarcodeReader>
      </label>
    </div>

    <!-- Second row -->
    <div class="input-group__row">
      <input
        type="text"
        class="text-input"
        placeholder="Enter a barcode"
        v-model="barcode"
        @input="onInput"
      />
      <button
        class="entry-btn search-btn"
        :class="{ 'search-btn--active': barcode }"
        @click="searchProduct"
      >
        <Icon icon="mdi:search" width="24" height="24" />
        Search
      </button>
    </div>
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
</template>

<script>
import { Icon } from "@iconify/vue";
import { StreamBarcodeReader, ImageBarcodeReader } from 'vue-barcode-reader';

export default {
  name: "BarcodeEntry",
  emits: ["product-fetched"],
  data() {
    return {
      barcode: "",
      loading: false,
      error: null,
      showCamera: false,
    };
  },
  methods: {
    toggleCamera() {
      this.showCamera = !this.showCamera;
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
          this.$emit("product-fetched", data.product);
        } else {
          this.error = "No product found with this barcode.";
          this.$emit("product-fetched", null);
        }
      } catch (err) {
        this.error = "An error occurred while fetching data.";
        this.$emit("product-fetched", null);
      } finally {
        this.loading = false;
      }
    },
    onDecode(result) {
      console.log("Decoded:", result);
      console.log("Barcode:", result.text);
      if (result && result.text) {
        this.barcode = result.text;
        this.showCamera = false;
        this.stopCamera();
      }
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
.barcode-entry {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: calc(100% + 32px);
}

.input-group__row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.entry-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.scan-btn {
  flex: 1;
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border-color: var(--vp-button-brand-border);
}

.scan-btn--active {
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
  border-color: var(--vp-button-alt-hover-border);
}

.upload-btn {
  flex: 1;
  position: relative;
  justify-content: center;
}

.hidden-upload {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.text-input {
  width: 66%;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 1rem;
}

.search-btn {
  width: 34%;
}

.search-btn--active {
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border-color: var(--vp-button-brand-border);
}

/* Keep your existing camera styles */
.camera {
  position: relative;
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
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
</style>
