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
import { ref } from "vue";
import { BrowserMultiFormatReader } from "@zxing/library";

const codeReader = ref(new BrowserMultiFormatReader());
const emit = defineEmits(["decode", "error"]);

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
    const result = await codeReader.value.decodeFromImage("temp-image");
    emit("decode", result);
  } catch (error) {
    emit("error", error);
  } finally {
    document.body.removeChild(img);
  }
};
</script>
