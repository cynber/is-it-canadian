<!-- Based on code from https://github.com/olefirenko/vue-barcode-reader -->

<template>
  <input
    @change="onChangeInput"
    type="file"
    name="image"
    accept="image/*"
    capture="environment"
  />
</template>

<script setup>
import { shallowRef } from "vue";

const codeReader = shallowRef();
const emit = defineEmits(["decode", "error"]);

const getCodeReader = async () => {
  if (!codeReader.value) {
    const { BrowserMultiFormatReader } = await import("@zxing/library");
    codeReader.value = new BrowserMultiFormatReader();
  }
  return codeReader.value;
};

const onChangeInput = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  const reader = new FileReader();
  reader.onload = processFile;
  reader.readAsDataURL(files[0]);
};

const processFile = async (e) => {
  const img = document.createElement("img");
  img.id = "temp-image";
  img.src = e.target.result;
  document.body.appendChild(img);

  try {
    const reader = await getCodeReader();
    const result = await reader.decodeFromImage("temp-image");
    emit("decode", result);
  } catch (error) {
    emit("error", error);
  } finally {
    document.body.removeChild(img);
  }
};
</script>
