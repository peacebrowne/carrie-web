<template>
  <div class="p-menubar border-0 rounded-none py-0">
    <Menubar
      :model="items"
      class="container border-0 rounded-none mx-auto px-10 w-full"
    >
      <template #start> <span class="font-black">Carrie</span> </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span class="text-sm">{{ item.label }}</span>
          <Badge
            v-if="item.badge"
            :class="{ 'ml-auto': !root, 'ml-2': root }"
            :value="item.badge"
          />
          <span
            v-if="item.shortcut"
            class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down ml-auto',
              { 'pi-angle-down': root, 'pi-angle-right': !root },
            ]"
          ></i>
        </a>
      </template>
      <template #end>
        <div class="flex items-center gap-2 ml-auto">
          <InputText
            placeholder="Search"
            type="search"
            class="w-32 py-1 text-sm min-w-0 grow sm:w-auto"
          />
          <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from "vue";

const items = ref([
  // {
  //   separator: true,
  // },
  // {
  //   label: "Documents",
  //   items: [
  //     {
  //       label: "New",
  //       icon: "pi pi-plus",
  //       shortcut: "⌘+N",
  //     },
  //     {
  //       label: "Search",
  //       icon: "pi pi-search",
  //       shortcut: "⌘+S",
  //     },
  //   ],
  // },
  // {
  //   label: "Profile",
  //   items: [
  //     {
  //       label: "Settings",
  //       icon: "pi pi-cog",
  //       shortcut: "⌘+O",
  //     },
  //     {
  //       label: "Messages",
  //       icon: "pi pi-inbox",
  //       badge: 2,
  //     },
  //     {
  //       label: "Logout",
  //       icon: "pi pi-sign-out",
  //       shortcut: "⌘+Q",
  //     },
  //   ],
  // },
  // {
  //   separator: true,
  // },
]);
</script>
