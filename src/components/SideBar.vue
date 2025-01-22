<template>
  <!-- PanelMenu with scrollable items -->
  <ScrollPanel class="sidebar w-full !max-h-[80vh] p-0">
    <PanelMenu :model="items" class="w-full md:w-[12rem]">
      <template #item="{ item }">
        <router-link
          v-if="item.name"
          :to="{ name: item.name }"
          class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-1"
        >
          <!-- <a v-ripple :href="href" @click="navigate"> -->
          <span :class="item.icon" />
          <span class="ml-2 text-sm">{{ item.label }}</span>
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
          <span class="ml-2">{{ item.label }}</span>
          <span
            v-if="item.items"
            :class="[
              'pi',
              dropdown ? ' pi-angle-up' : 'pi-angle-down',
              'text-primary ml-auto',
            ]"
          />
        </a>
      </template>
    </PanelMenu>
  </ScrollPanel>
  <div class="">
    <Button
      v-styleclass="{
        selector: '.sidebar',
        toggleClass: 'hidden',
      }"
      @click="toggleSideBar"
      rounded
      size="small"
      variant="outlined"
      severity="contrast"
      aria-label="Filter"
    >
      <span
        :class="[
          visible ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left',
          '!text-xs ',
        ]"
      ></span>
    </Button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const items = ref([
  {
    label: "Dashboard",
    icon: "pi pi-th-large",
    name: "dashboard",
  },
  {
    label: "Article",
    icon: "pi pi-comment",
    items: [
      {
        label: "List",
        icon: "pi pi-image",
        name: "list",
      },
      {
        label: "Edit",
        icon: "pi pi-pencil",
        name: "edit",
      },
    ],
  },

  {
    label: "Account",
    icon: "pi pi-user",
    name: "account",
  },
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    command: () => {
      router.push("/logout");
    },
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
