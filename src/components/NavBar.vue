<template>
  <Menubar class=" border-0 rounded-none mx-auto pt-4 px-10 w-full">
    <template #start> <span class="font-black">Carrie</span> </template>
    <template #end>
      <div class="flex items-center gap-2 ml-auto">
        <InputText
          placeholder="Search"
          type="search"
          class="w-32 py-1 text-sm min-w-0 grow sm:w-auto"
        />

        <ToggleSwitch
          v-model="checked"
          class="!h-[1.9rem] w-12"
          @click="toggleDarkMode"
        >
          <template #handle="{ checked }">
            <i
              :class="[
                '!text-xs pi',
                { 'pi-sun': checked, 'pi-moon': !checked },
              ]"
            />
          </template>
        </ToggleSwitch>

        <OverlayBadge
          value="4"
          @click="toggleDropdownMenu"
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

        <Menu ref="menu" id="overlay_menu" :model="userItems" :popup="true" />

        
      </div>
    </template>
  </Menubar>
</template>

<script setup>
import { cookiesStore } from "@/stores";
import { ref, onMounted } from "vue";
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

const toggleDropdownMenu = (event) => {
  menu.value.toggle(event);
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

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  }
});
</script>
