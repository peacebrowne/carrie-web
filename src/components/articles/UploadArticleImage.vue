<template>
  <FileUpload
    mode="advanced"
    @select="onFileSelect"
    accept="image/*"
    customUpload
    auto
    severity="secondary"
    class="p-button-outlined"
    name="image"
  >
    <template #header="{ chooseCallback }">
      <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
        <div class="flex gap-2">
          <Button
            @click="chooseCallback()"
            icon="pi pi-images"
            rounded
            outlined
            severity="secondary"
            raised
          ></Button>

          <Button
            @click="clearCallback()"
            icon="pi pi-times"
            rounded
            outlined
            severity="danger"
            :disabled="!src"
            raised
          ></Button>
        </div>
      </div>
    </template>
    <template #content>
      <Image
        preview
        v-if="src"
        :src="src"
        id="cover-image"
        alt="Image"
        imageClass="w-full object-cover object-center rounded-md"
        class="w-[94%] h-[94%] absolute top-0"
      />
    </template>
    <template #empty>
      <div class="flex flex-col justify-center items-center gap-2">
        <div>
          <i
            class="pi pi-image !border !rounded-full !p-4 !text-4xl !text-muted-color"
          />
        </div>

        <span>Drag and drop a cover image.</span>
      </div>
    </template>
  </FileUpload>
</template>

<script setup>
import { onMounted } from "vue";

const image = defineModel("image");
const src = defineModel("src");

function onFileSelect(event) {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e.target.result;
  };

  image.value = file;
  reader.readAsDataURL(file);
}

const clearCallback = () => {
  image.value = "";
  src.value = "";
};

onMounted(() => {});
</script>

<style>
.p-fileupload,
.p-fileupload svg {
  font-size: small;
}

.p-fileupload-advanced {
  width: 100%;
  height: 240px;
  display: flex;
  flex-direction: column;
}
.p-fileupload-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 0 !important;
}
</style>
