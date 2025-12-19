<template>
  <div class="card flex justify-center">
    <TieredMenu
      :model="items"
      popup
      id="overlay_tmenu"
      ref="menu"
      class="pb-3 mt-2 min-w-[15rem]"
    >
      <template #start>
        <router-link :to="{ name: 'profile' }">
          <Button variant="text" severity="secondary" class="w-full">
            <div class="flex items-center justify-start w-full px-1">
              <div class="relative">
                <Avatar
                  v-if="src"
                  :image="src"
                  class="w-10 h-10 mr-2"
                  shape="circle"
                />
                <Avatar
                  v-else
                  icon="pi pi-user"
                  class="mr-2 border w-10 h-10"
                  shape="circle"
                />
              </div>
              <div class="flex flex-col items-start">
                <span class="text-normal font-bold leading-none"
                  >{{ author.firstName }} {{ author.lastName }}</span
                >
                <span class="text-xs">View profile</span>
              </div>
            </div>
          </Button>
        </router-link>
      </template>
      <template #item="{ item, props }">
        <a
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
          class="px-5"
        >
          <span :class="item.icon" />
          <span class="font-normal ml-2">{{ item.label }}</span>
        </a>
      </template>
      <template #end>
        <Divider />
        <div class="flex gap-2">
          <router-link class="w-full" :to="{ name: 'login' }">
            <Button class="w-full" variant="text" severity="secondary">
              <div class="flex flex-col items-start justify-start w-full px-1">
                <div class="text-sm font-bold leading-none">Sign out</div>
                <div class="text-xs font-normal leading-none">
                  {{
                    author.email.replace(
                      /^(.{2}).+(@)/,
                      (_, start, end) =>
                        start + ".".repeat(author.email.indexOf(end) - 2) + end
                    )
                  }}
                </div>
              </div>
            </Button>
          </router-link>
        </div>
        <Divider />
      </template>
    </TieredMenu>

    <div @click="toggle" class="cursor-pointer">
      <Avatar v-if="src" :image="src" shape="circle" class="w-10 h-10" />

      <Avatar
        v-else
        icon="pi pi-user text-white text-xs"
        shape="circle"
        class="bg-[#1B4D3E] w-10 h-10"
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
const menu = ref();

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
    label: "Settings",
    icon: "pi pi-cog text-lg",
    command: () => {
      router.push("/settings");
    },
  },
  {
    label: "Help",
    icon: "pi pi-question-circle text-lg",
    command: () => {
      router.push("/help");
    },
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<style scoped></style>
