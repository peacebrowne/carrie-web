<template>
  <div class="card flex justify-center">
    <Drawer
      pt:header:class="flex items-center shadow-sm pb-3"
      pt:closeButtonProps:class="bg-red-600"
      v-model:visible="visible"
      header="Right Drawer"
      position="right"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <Avatar v-if="src" :image="src" shape="circle" />

          <Avatar
            v-else
            icon="pi pi-user text-white text-xs"
            shape="circle"
            class="bg-[#1B4D3E]"
          />
          <span class="font-bold"
            >{{ author.firstName }} {{ author.lastName }}</span
          >
        </div>
      </template>
      <Menu :model="items" class="border-none h-full">
        <template #item="{ item }">
          <router-link
            v-if="item.name"
            :to="{ name: item.name }"
            class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-1"
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
              class="ml-2 text-xs"
              >{{ item.label }}</span
            >
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
      </Menu>
      <template #footer>
        <div class="flex items-center gap-2">
          <router-link class="w-full" :to="{ name: 'login' }">
            <Button
              label="Logout"
              icon="pi pi-sign-out text-sm"
              class="flex-auto text-sm w-full"
              severity="danger"
              text
            ></Button>
          </router-link>
        </div>
      </template>
    </Drawer>
    <!-- <Button icon="pi pi-bars" @click="visible = true" /> -->

    <div @click="visible = true" class="cursor-pointer">
      <Avatar v-if="src" :image="src" shape="circle" />

      <Avatar
        v-else
        icon="pi pi-user text-white text-xs"
        shape="circle"
        class="bg-[#1B4D3E]"
      />
    </div>
  </div>
</template>

<script setup>
import { getImage } from "@/assets/js/service";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "@/stores";

const visible = ref(false);
const src = ref(null);
const author = ref("");

const fetchUserImage = async (id) => {
  if (id) {
    const { data, ok } = await getImage(id);

    if (ok && data.size) {
      return URL.createObjectURL(data);
    }
  }
};

onMounted(async () => {
  const { getUser } = userStore();
  author.value = await getUser();
  src.value = await fetchUserImage(localStorage.getItem("app-author-id"));
});

const route = useRoute();
const router = useRouter();
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
    name: "stories",
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

const logOut = () => {
  const { removeCookie } = cookiesStore();
  removeCookie();
  Array.of("app-author-id", "app-article-id").forEach((item) =>
    localStorage.removeItem(item)
  );

  isLoggedIn.value = false;
  router.push("/auth/login");
};
</script>

<style scoped></style>
