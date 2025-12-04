<template>
  <Menubar
    class="border-0 py-3 px-16 rounded-none w-full shadow-sm"
    :model="items"
    pt:rootList:class="m-auto"
  >
    <template #start>
      <div class="flex items-center gap-4">
        <router-link :to="{ name: 'landing-page' }">
          <span class="font-black text-2xl">Carrie</span>
        </router-link>
        <IconField id="search">
          <InputIcon class="pi pi-search text-sm" />
          <InputText class="py-1 rounded-full" placeholder="Search" />
        </IconField>
      </div>
    </template>

    <template #item="{ item }">
      <router-link
        v-if="item.name"
        :to="{ name: item.name }"
        class="flex items-center font-bold cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-1"
        :class="{ 'p-panelmenu-item-active': isActive(item.name) }"
      >
        <span
          :class="[
            isActive(item.name) ? 'p-panelmenu-item-icon' : '',
            item.icon,
          ]"
        />
        <span
          :class="{ 'p-panelmenu-item-icon': isActive(item.name) }"
          class="ml-2 text-sm"
          >{{ item.label }}</span
        >
      </router-link>
      <a
        v-else
        v-ripple
        class="test flex items-center cursor-pointer text-surface-700 font-bold dark:text-surface-0 px-4 py-1"
        :to="{ name: item.name }"
        :target="item.target"
        @click="toggleDropdownIcon"
      >
        <span :class="item.icon" />
        <span class="ml-2 text-sm">{{ item.label }}</span>
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

    <template #end>
      <div class="flex items-center gap-4 ml-auto">
        <div id="write" v-if="!writeMode">
          <router-link :to="{ name: 'write' }">
            <Button
              class="py-1 text-sm"
              severity="secondary"
              variant="outlined"
              rounded
              aria-label="Write"
              icon="pi pi-plus text-sm"
              label="Write"
            />
          </router-link>
        </div>

        <div class="mt-[.5rem] cursor-pointer">
          <OverlayBadge value="2" size="small" severity="warn">
            <i class="pi pi-bell text-xl" severity="secondary" />
          </OverlayBadge>
        </div>

        <ToggleSwitch
          v-model="checked"
          class="!h-[2rem] w-12 hidden"
          @click="toggleDarkMode"
          severity="secondary"
          variant="outlined"
        >
          <template #handle="{ checked }">
            <i
              :class="[
                '!text-sm pi',
                { 'pi-sun': checked, 'pi-moon': !checked },
              ]"
            />
          </template>
        </ToggleSwitch>

        <div v-if="isLoggedIn">
          <SideBar />
        </div>

        <router-link v-else :to="{ name: 'login' }">
          <span class="text-sm font-bold">login</span>
        </router-link>
      </div>
    </template>
  </Menubar>
</template>

<script setup>
import { cookiesStore } from "@/stores";
import { ref, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import SideBar from "@/components/SideBar.vue";

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);

const handleIsLoggedIn = () => {
  const { getCookie } = cookiesStore();
  const token = getCookie();

  isLoggedIn.value = token ? true : false;
};

const checked = ref(false);
const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

onMounted(async () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  }

  handleIsLoggedIn();
});

const writeMode = inject("writeMode");

const isActive = (path) => route.path.split("/")[2] === path;

const items = ref([
  {
    label: "Stats",
    icon: "pi pi-th-large",
    name: "dashboard",
  },
  {
    label: "My Stories",
    icon: "pi pi-book",
    name: "stories",
  },
  {
    label: "Chats",
    icon: "pi pi-comments",
    name: "chats",
  },

  {
    label: "Trash",
    icon: "pi pi-trash",
    name: "trash",
  },
]);
</script>

<style>
.p-menubar-root-list {
  margin: auto !important;
}
</style>
