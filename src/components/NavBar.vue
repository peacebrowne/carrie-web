<template>
  <div class="p-menubar border-0 rounded-none py-0">
    <Menubar
      :model="items"
      class="container border-0 rounded-none mx-auto mt-1 px-10 w-full"
    >
      <template #start> <span class="font-black">Carrie</span> </template>
      <!-- <template #item="{ item, props, hasSubmenu, root }">
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
      </template> -->
      <template #end>
        <div class="flex items-center gap-2 ml-auto">
          <InputText
            placeholder="Search"
            type="search"
            class="w-32 py-1 text-sm min-w-0 grow sm:w-auto"
          />

          <OverlayBadge
            value="4"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_tmenu"
            severity="info"
            class="inline-flex cursor-pointer"
            size="small"
          >
            <Avatar
              icon="pi pi-user text-white text-xs"
              shape="circle"
              class="bg-[#1B4D3E]"
            />
          </OverlayBadge>

          <TieredMenu
            ref="menu"
            id="overlay_tmenu"
            class="text-xs"
            :model="userItems"
            popup
            :pt="{
              root: { class: 'min-w-[11rem] top-[2.875rem] left-[69.375rem]' },
            }"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { cookiesStore } from "@/stores";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const menu = ref();
const userItems = ref([
  {
    label: "Notification",
    icon: "pi pi-bell",
  },
  {
    separator: true,
  },
  {
    label: "Logout",
    icon: "pi pi-power-off",
    command: () => {
      logOut();
    },
  },
]);

const logOut = () => {
  const { removeCookie } = cookiesStore();
  removeCookie();
  Array.of("app-author-id", "app-article-id").forEach((item) =>
    localStorage.removeItem(item)
  );

  router.push("/login");
};

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>
