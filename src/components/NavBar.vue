<template>
  <Menubar class="border-0 rounded-none mx-auto py-3 px-10 w-full shadow-sm">
    <template #start>
      <router-link :to="{ name: 'landing-page' }">
        <span class="font-black">Carrie</span>
      </router-link>
    </template>
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

        <div v-if="isLoggedIn">
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

        <router-link v-else :to="{ name: 'login' }">
          <span class="text-xs font-bold">login</span>
        </router-link>
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

const isLoggedIn = ref(false);

const handleIsLoggedIn = () => {
  const { getCookie } = cookiesStore();
  const token = getCookie();

  isLoggedIn.value = token ? true : false;
};

const logOut = () => {
  const { removeCookie } = cookiesStore();
  removeCookie();
  Array.of("app-author-id", "app-article-id").forEach((item) =>
    localStorage.removeItem(item)
  );

  isLoggedIn.value = false;
  router.push("/");
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

  handleIsLoggedIn();
});
</script>
