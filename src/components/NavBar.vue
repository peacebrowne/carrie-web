<template>
  <Menubar class="border-0 py-3 px-16 rounded-none w-full shadow-sm">
    <template #start>
      <div class="flex items-center gap-4">
        <router-link :to="{ name: 'landing-page' }">
          <span class="font-black text-2xl">Carrie</span>
        </router-link>
        <IconField id="search" v-if="!writeMode">
          <InputIcon class="pi pi-search text-sm" />
          <InputText class="py-1 rounded-full" placeholder="Search" />
        </IconField>
      </div>
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
          <span class="text-xs font-bold">login</span>
        </router-link>
      </div>
    </template>
  </Menubar>
</template>

<script setup>
import { cookiesStore } from "@/stores";
import { ref, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import SideBar from "@/components/SideBar.vue";

const router = useRouter();

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
</script>
