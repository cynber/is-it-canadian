<!-- Based on code from https://github.com/olefirenko/vue-barcode-reader -->

<template>
  <div class="scanner-container">
    <div v-show="!isLoading">
      <video ref="scanner" poster="data:image/gif,AAAA"></video>
      <div class="overlay-element"></div>
      <div class="laser"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { BrowserMultiFormatReader } from "@zxing/library";

const props = defineProps({
  constraints: {
    type: Object,
    default: () => ({
      facingMode: "environment",
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
    }),
  },
});

const emit = defineEmits(["decode", "loaded", "error"]);
const scanner = ref(null);
const isLoading = ref(true);
const codeReader = ref(new BrowserMultiFormatReader());

const start = async () => {
  try {
    await codeReader.value.decodeFromVideoDevice(
      undefined,
      scanner.value,
      (result, err) => {
        if (result) {
          emit("decode", result);
        }
        if (err) {
          emit("error", err);
        }
      },
      props.constraints
    );
  } catch (error) {
    emit("error", error);
  }
};

onMounted(() => {
  if (!navigator?.mediaDevices?.enumerateDevices) {
    emit("error", new Error("Media Stream API is not supported"));
    return;
  }

  start();
  scanner.value.oncanplay = () => {
    isLoading.value = false;
    emit("loaded");
  };
});

onBeforeUnmount(() => {
  codeReader.value.reset();
});
</script>

<style scoped>
.scanner-container {
  position: relative;
  width: 100%;
}

video {
  width: 100%;
  max-height: 100%;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
}

.overlay-element {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, 0.5);
  clip-path: polygon(
    0% 0%,
    0% 100%,
    20% 100%,
    20% 20%,
    80% 20%,
    80% 80%,
    20% 80%,
    20% 100%,
    100% 100%,
    100% 0%
  );
}

.laser {
  width: 60%;
  margin-left: 20%;
  background-color: tomato;
  height: 1px;
  position: absolute;
  top: 40%;
  z-index: 2;
  box-shadow: 0 0 4px red;
  animation: scanning 2s infinite;
}

@keyframes scanning {
  50% {
    transform: translateY(75px);
  }
}
</style>
