<template>
  <Breadcrumb :model="items">
    <template #item="{ item, props }">
      <a :href="item.url" :target="item.target" v-bind="props.action">
        <span class="text-surface-700 text-xs dark:text-surface-0">{{
          item.label
        }}</span>
      </a>
    </template>
    <template #separator> / </template>
  </Breadcrumb>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const home = ref({
  icon: "pi pi-home",
  route: "/introduction",
});
const items = ref([]);
const route = useRoute();

watch(
  () => route,
  (newRoute, oldRoute) => {
    handleBreadCrumbs(newRoute.fullPath);
  },
  { deep: true }
);

const handleBreadCrumbs = (routes) => {
  items.value = routes
    .split("/")
    .slice(2)
    .map((path) => {
      return {
        label: decodeURIComponent(decodeURIComponent(path)),
      };
    });
};

onMounted(() => {
  handleBreadCrumbs(route.fullPath);
});
</script>
