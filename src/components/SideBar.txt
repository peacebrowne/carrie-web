<template>
  <!-- PanelMenu with scrollable items -->
  <ScrollPanel class="sidebar w-full !max-h-[80vh] p-0">
    <PanelMenu :model="items" class="w-full md:w-[12rem]">
      <template #item="{ item }">
        <router-link
          v-if="item.name"
          :to="{ name: item.name }"
          class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-1"
          :class="{ 'p-panelmenu-item-active': isActive(item.name) }"
        >
          <!-- <a v-ripple :href="href" @click="navigate"> -->
          <span
            :class="[
              isActive(item.name) ? 'p-panelmenu-item-icon' : '',
              item.icon,
            ]"
          />
          <span
            :class="{ 'p-panelmenu-item-icon': isActive(item.name) }"
            class="ml-2 text-xs"
            >{{ item.label }}</span
          >
          <!-- </a> -->
        </router-link>
        <a
          v-else
          v-ripple
          class="test flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-1"
          :to="{ name: item.name }"
          :target="item.target"
          @click="toggleDropdownIcon"
        >
          <span :class="item.icon" />
          <span class="ml-2 text-xs">{{ item.label }}</span>
          <span
            v-if="item.items"
            :class="[
              'pi',
              dropdown ? ' pi-angle-up' : 'pi-angle-down',
              'text-secondary ml-auto',
            ]"
          />
        </a>
      </template>
    </PanelMenu>
    <div class="pt-8 w-full md:w-[12rem]">
      <router-link :to="{ name: 'write' }">
        <Button class="py-1" severity="warn" raised>
          <span class="text-xs">New article</span>
          <span class="pi pi-plus text-sm"></span>
        </Button>
      </router-link>
    </div>
  </ScrollPanel>
  <div class="">
    <Button
      v-styleclass="{
        selector: '.sidebar',
        toggleClass: 'hidden',
      }"
      @click="toggleSideBar"
      severity="secondary"
      text
      rounded
    >
      <span
        :class="[
          'pi',
          visible ? ' pi-angle-double-right' : 'pi pi-angle-double-left',
        ]"
      ></span>
    </Button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isActive = (path) => route.path.split("/")[2] === path;
const items = ref([
  {
    label: "Dashboard",
    icon: "pi pi-th-large",
    name: "dashboard",
  },
  {
    label: "My articles",
    icon: "pi pi-book",
    name: "list",
  },

  {
    label: "Profile",
    icon: "pi pi-user",
    name: "profile",
  },
  {
    label: "Trash",
    icon: "pi pi-trash",
    name: "trash",
  },
]);

const visible = ref(false);
const dropdown = ref(false);

const toggleSideBar = () => (visible.value = !visible.value);
const toggleDropdownIcon = () => (dropdown.value = !dropdown.value);
</script>

<style>
.p-panelmenu-item {
  margin-top: 0.4rem !important;
  margin-bottom: 0.4rem !important;
}
</style>
