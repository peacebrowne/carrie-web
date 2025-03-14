<template>
  <nav class="sticky w-full z-50 top-0">
    <NavBar />
  </nav>
  <div
    class="p-menubar items-center border-0 rounded-none lg:py-8 h-[calc(100vh-56px)]"
  >
    <ScrollPanel
      id="main-content"
      class="w-full h-full mx-auto md:px-8 lg:px-24 container"
    >
      <div class="flex w-full h-full">
        <Tabs value="0" class="container flex-1 mx-auto h-full">
          <TabList>
            <Tab value="0">Home</Tab>
            <Tab value="1">Following</Tab>
            <Tab value="2">Shared</Tab>
          </TabList>
          <TabPanels class="h-full">
            <TabPanel value="0" class="h-full">
              <ScrollPanel class="w-full h-full">
                <Panel class="border-none relative">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <Avatar
                        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                        shape="circle"
                      />
                      <span class="font-bold">Amy Eisner</span>
                      <Button
                        class="text-xs"
                        rounded
                        text
                        label="Follow"
                      ></Button>
                    </div>
                  </template>
                  <template #icons>
                    <Button
                      icon="pi pi-ellipsis-h"
                      severity="secondary"
                      rounded
                      text
                      @click="toggle"
                    />
                    <Menu ref="menu" id="config_menu" :model="items" popup />
                  </template>
                  <div class="flex">
                    <router-link :to="{}">
                      <Card
                        pt:header:class="w-48 h-32"
                        pt:body:class="flex-1 pl-0 py-0"
                        class="shadow-none rounded-none items-start overflow-hidden flex-row-reverse w-full gap-4"
                      >
                        <!-- Image -->
                        <template #header>
                          <img
                            src="../assets/images/pexels-vlada-karpovich-4452120.jpg"
                            alt="Mock Negotiation"
                            class="w-full h-full object-cover"
                          />
                        </template>

                        <!-- Text Content -->
                        <template #content>
                          <div class="text-start">
                            <h3 class="font-black text-3xl">
                              Use Git like a senior engineer
                            </h3>
                            <p class="text-1xl">
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et
                            </p>
                          </div>
                        </template>

                        <template #footer>
                          <div
                            class="flex flex-wrap items-center justify-between gap-4 mt-4"
                          >
                            <div class="flex items-center gap-4">
                              <div
                                class="flex gap-1 items-center"
                                v-tooltip.top="'50 likes'"
                              >
                                <span class="pi pi-thumbs-up text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>
                              <div
                                class="flex gap-1 items-center"
                                v-tooltip.top="'50 dislikes'"
                              >
                                <span class="pi pi-thumbs-down text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>

                              <div
                                class="flex gap-1 items-center"
                                v-tooltip.top="'50 comments'"
                              >
                                <span class="pi pi-comments text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>

                              <div
                                v-tooltip.top="'50 shares'"
                                class="flex gap-1 items-center"
                              >
                                <span class="pi pi-share-alt text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>
                            </div>

                            <div class="flex gap-1 items-center">
                              <span class="pi pi-calendar text-xs"></span>
                              <span
                                class="text-surface-500 text-xs font-bold dark:text-surface-400"
                                >Jan 2, 2025</span
                              >
                            </div>
                          </div>
                        </template>
                      </Card>
                    </router-link>
                  </div>
                </Panel>

                <Divider type="dashed" />

                <Panel class="border-none relative">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <Avatar
                        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                        shape="circle"
                      />
                      <span class="font-bold">Amy Eisner</span>
                      <Button
                        class="text-xs"
                        rounded
                        text
                        label="Follow"
                      ></Button>
                    </div>
                  </template>
                  <template #icons>
                    <Button
                      icon="pi pi-ellipsis-h"
                      severity="secondary"
                      rounded
                      text
                      @click="toggle"
                    />
                    <Menu ref="menu" id="config_menu" :model="items" popup />
                  </template>
                  <div class="flex">
                    <router-link :to="{}">
                      <Card
                        pt:header:class="w-48 h-32"
                        pt:body:class="flex-1 pl-0 py-0"
                        class="shadow-none rounded-none items-start overflow-hidden flex-row-reverse w-full gap-4"
                      >
                        <!-- Image -->
                        <template #header>
                          <img
                            src="../assets/images/pexels-vlada-karpovich-4452120.jpg"
                            alt="Mock Negotiation"
                            class="w-full h-full object-cover"
                          />
                        </template>

                        <!-- Text Content -->
                        <template #content>
                          <div class="text-start">
                            <h3 class="font-black text-3xl">
                              Use Git like a senior engineer
                            </h3>
                            <p class="text-1xl">
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et
                            </p>
                          </div>
                        </template>

                        <template #footer>
                          <div
                            class="flex flex-wrap items-center justify-between gap-4 mt-4"
                          >
                            <div class="flex items-center gap-4">
                              <div
                                class="flex gap-1 items-center"
                                v-tooltip.top="'50 likes'"
                              >
                                <span class="pi pi-thumbs-up text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>
                              <div
                                class="flex gap-1 items-center"
                                v-tooltip.top="'50 dislikes'"
                              >
                                <span class="pi pi-thumbs-down text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>

                              <div
                                class="flex gap-1 items-center"
                                v-tooltip.top="'50 comments'"
                              >
                                <span class="pi pi-comments text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>

                              <div
                                v-tooltip.top="'50 shares'"
                                class="flex gap-1 items-center"
                              >
                                <span class="pi pi-share-alt text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>
                            </div>

                            <div class="flex gap-1 items-center">
                              <span class="pi pi-calendar text-xs"></span>
                              <span
                                class="text-surface-500 text-xs font-bold dark:text-surface-400"
                                >Jan 2, 2025</span
                              >
                            </div>
                          </div>
                        </template>
                      </Card>
                    </router-link>
                  </div>
                </Panel>

                <Divider type="dashed" />

                <Panel class="border-none relative">
                  <template #header>
                    <div class="flex items-center gap-2">
                      <Avatar
                        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                        shape="circle"
                      />
                      <span class="font-bold">Amy Eisner</span>
                      <Button
                        class="text-xs"
                        rounded
                        text
                        label="Follow"
                      ></Button>
                    </div>
                  </template>
                  <template #icons>
                    <Button
                      icon="pi pi-ellipsis-h"
                      severity="secondary"
                      rounded
                      text
                      @click="toggle"
                    />
                    <Menu ref="menu" id="config_menu" :model="items" popup />
                  </template>
                  <div class="flex">
                    <router-link :to="{}">
                      <Card
                        pt:header:class="w-48 h-32"
                        pt:body:class="flex-1 pl-0 py-0"
                        class="shadow-none rounded-none items-start overflow-hidden flex-row-reverse w-full gap-4"
                      >
                        <!-- Image -->
                        <template #header>
                          <img
                            src="../assets/images/pexels-vlada-karpovich-4452120.jpg"
                            alt="Mock Negotiation"
                            class="w-full h-full object-cover"
                          />
                        </template>

                        <!-- Text Content -->
                        <template #content>
                          <div class="text-start">
                            <h3 class="font-black text-3xl">
                              Use Git like a senior engineer
                            </h3>
                            <p class="text-1xl">
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et
                            </p>
                          </div>
                        </template>

                        <template #footer>
                          <div
                            class="flex flex-wrap items-center justify-between gap-4 mt-4"
                          >
                            <div class="flex items-center gap-4">
                              <div
                                class="flex gap-1 items-center"
                                v-tooltip.top="'50 likes'"
                              >
                                <span class="pi pi-thumbs-up text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>
                              <div
                                class="flex gap-1 items-center"
                                v-tooltip.top="'50 dislikes'"
                              >
                                <span class="pi pi-thumbs-down text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>

                              <div
                                class="flex gap-1 items-center"
                                v-tooltip.top="'50 comments'"
                              >
                                <span class="pi pi-comments text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>

                              <div
                                v-tooltip.top="'50 shares'"
                                class="flex gap-1 items-center"
                              >
                                <span class="pi pi-share-alt text-xs"></span>
                                <span class="text-xs">50</span>
                              </div>
                            </div>

                            <div class="flex gap-1 items-center">
                              <span class="pi pi-calendar text-xs"></span>
                              <span
                                class="text-surface-500 text-xs font-bold dark:text-surface-400"
                                >Jan 2, 2025</span
                              >
                            </div>
                          </div>
                        </template>
                      </Card>
                    </router-link>
                  </div>
                </Panel>

                <div
                  class="result"
                  v-for="comment in comments"
                  :key="comment.id"
                >
                  <div>{{ comment.email }}</div>
                  <div>{{ comment.id }}</div>
                </div>
                <InfiniteLoading @infinite="load" />
              </ScrollPanel>
            </TabPanel>

            <TabPanel value="1">
              <p class="m-0">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt. Consectetur, adipisci velit, sed quia non numquam eius
                modi.
              </p>
            </TabPanel>

            <TabPanel value="2">
              <p class="m-0">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                rerum facilis est et expedita distinctio. Nam libero tempore,
                cum soluta nobis est eligendi optio cumque nihil impedit quo
                minus.
              </p>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Divider layout="vertical" />
        <div class="w-72 ..."></div>
      </div>
    </ScrollPanel>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import Menu from "primevue/menu";
import { getArticles } from "@/assets/js/service";

import InfiniteLoading from "v3-infinite-loading";

let comments = ref([]);
let page = 1;
const load = async ($state) => {
  console.log("loading...");

  try {
    const response = await getArticles();
    console.log({ response });
    // const json = await response.json();
    // if (json.length < 10) $state.complete();
    // else {
    //   comments.value.push(...json);
    //   $state.loaded();
    // }
    page++;
  } catch (error) {
    $state.error();
  }
};

const menu = ref(null);
const router = useRouter();

const items = ref([
  {
    label: "Refresh",
    icon: "pi pi-refresh",
  },
  {
    label: "Search",
    icon: "pi pi-search",
  },
  {
    separator: true,
  },
  {
    label: "Delete",
    icon: "pi pi-times",
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<style scoped></style>
