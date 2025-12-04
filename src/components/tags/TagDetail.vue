<template>
  <nav
    class="w-full sticky z-[200] flex top-0"
    style="transform: translateY(0px)"
  >
    <NavBar />
  </nav>
  <div class="container m-auto flex w-full h-full md:px-8 lg:px-36 2xl:px-52">
    <div class="w-full">
      <Tabs v-model:value="activeTopicId" scrollable>
        <TabList>
          <Tab
            v-for="topic in recommendedTopics"
            :key="topic.name"
            :value="topic.id"
          >
            <router-link v-slot="{ href, navigate }" :to="topic.route" custom>
              <a
                v-ripple
                :href="href"
                @click="navigate"
                class="flex items-center text-sm gap-2 text-inherit"
              >
                <span>{{ topic.name }}</span>
              </a>
            </router-link>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel
            v-for="topic in recommendedTopics"
            :key="topic.name"
            :value="topic.id"
          >
            <div
              class="m-0 p-8 flex flex-col justify-center items-center gap-4"
            >
              <span class="text-4xl font-black">{{ topic.name }}</span>
              <div class="flex items-center gap-2 font-semibold">
                <span>Topic</span>
                <span class="pi pi-circle-fill text-[0.25rem]"></span
                ><span class="text-sm"
                  >{{ describeNumberScale(topic.popularity) }} followers</span
                >
                <span class="pi pi-circle-fill text-[0.25rem]"></span
                ><span class="text-sm"
                  >{{ describeNumberScale(topic.stories) }} stories</span
                >
              </div>
              <div>
                <Button
                  v-if="isFollowTopic"
                  class="text-xs"
                  severity="secondary"
                  variant="outlined"
                  rounded
                  label="Following"
                  @click="handleTopicFollow"
                />
                <Button
                  v-else
                  class="text-xs"
                  severity="contrast"
                  rounded
                  label="Follow"
                  @click="handleTopicFollow"
                />
              </div>
            </div>

            <div class="p-6 flex flex-col gap-8">
              <span class="text-2xl font-bold">Recommended stories</span>
              <div class="grid grid-cols-2 gap-6">
                <Card
                  v-for="article in firstTwoArticles"
                  :key="article.id"
                  class="w-full overflow-hidden rounded-none"
                  pt:body:class="h-full"
                  pt:footer:class="mt-auto"
                >
                  <template #header>
                    <router-link
                      class="w-full"
                      :to="{
                        name: 'public-article-detail',
                        params: { title: article.title },
                      }"
                      @click="handleArticleStore(article)"
                    >
                      <img
                        v-if="article.image"
                        :src="article.image"
                        class="w-full h-full object-cover"
                      />
                      <img
                        v-else
                        src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
                        alt="Mock Negotiation"
                        class="w-full h-full object-cover bas"
                      />
                    </router-link>
                  </template>
                  <template #content>
                    <div class="flex flex-col gap-2">
                      <div>
                        <router-link
                          class="text-sm font-bold flex items-center gap-2"
                        >
                          <Avatar
                            v-if="article.author.image"
                            :image="article.author.image"
                            shape="circle"
                          />

                          <Avatar
                            v-else
                            icon="pi pi-user text-white text-xs"
                            shape="circle"
                            class="bg-[#1B4D3E]"
                          />
                          <span class="font-bold"
                            >{{ article.author.firstName }}
                            {{ article.author.lastName }}</span
                          >
                        </router-link>
                      </div>

                      <router-link
                        class="w-full"
                        :to="{
                          name: 'public-article-detail',
                          params: { title: article.title },
                        }"
                        @click="handleArticleStore(article)"
                      >
                        <h3 class="font-black text-xl md:text-2xl">
                          {{ truncateText(article.title) }}
                        </h3>

                        <p class="text-lg">
                          {{ truncateText(article.description) }}
                        </p>
                      </router-link>
                    </div>
                  </template>
                  <template #footer>
                    <div class="mt-4 flex items-center w-full">
                      <router-link
                        class="flex items-center gap-4"
                        :to="{
                          name: 'public-article-detail',
                          params: { title: article.title },
                        }"
                        @click="handleArticleStore(article)"
                      >
                        <div class="flex gap-1 items-center">
                          <span
                            class="text-surface-500 text-sm font-normal dark:text-surface-400"
                            >{{
                              handleDateFormat(article.createdAt, "MMM DD")
                            }}</span
                          >
                        </div>

                        <div
                          class="flex gap-1 items-enter"
                          v-tooltip.top="`${article.likes} likes`"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            aria-labelledby="clap-filled-static-desc"
                            viewBox="0 0 16 16"
                            class="mt-[0.1rem]"
                          >
                            <desc id="clap-filled-static-desc">
                              A clap icon
                            </desc>
                            <path
                              fill="#6B6B6B"
                              fill-rule="evenodd"
                              d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <span class="text-sm">{{ article.likes }}</span>
                        </div>

                        <div
                          class="flex gap-1 items-center"
                          v-tooltip.top="`${article.totalComments} comments`"
                        >
                          <span class="pi pi-comments text-sm"></span>
                          <span class="text-sm">{{
                            article.totalComments
                          }}</span>
                        </div>
                      </router-link>

                      <div class="ml-auto w-28 flex justify-center">
                        <Button
                          v-if="article.isSaved"
                          v-tooltip.top="'Saved'"
                          class="text-sm"
                          icon="pi pi-bookmark-fill"
                          severity="secondary"
                          variant="text"
                          rounded
                          aria-label="Bookmark"
                          @click="removeArticleFromReadingList(article.id)"
                        />

                        <Button
                          v-else
                          v-tooltip.top="'Save'"
                          class="text-sm"
                          icon="pi pi-bookmark"
                          severity="secondary"
                          variant="text"
                          rounded
                          aria-label="Bookmark"
                          @click="addArticleToReadingList(article.id)"
                        />
                      </div>
                    </div>
                  </template>
                </Card>
              </div>

              <div class="grid grid-cols-3 gap-6">
                <Card
                  v-for="article in remainingArticles"
                  :key="article.id"
                  class="w-full overflow-hidden rounded-none"
                  pt:footer:class="mt-auto"
                  pt:body:class="h-full"
                >
                  <template #header>
                    <router-link
                      class="w-full"
                      :to="{
                        name: 'public-article-detail',
                        params: { title: article.title },
                      }"
                      @click="handleArticleStore(article)"
                    >
                      <img
                        v-if="article.image"
                        :src="article.image"
                        class="w-full h-full object-cover"
                      />
                      <img
                        v-else
                        src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
                        alt="Mock Negotiation"
                        class="w-full h-full object-cover bas"
                      />
                    </router-link>
                  </template>
                  <template #content>
                    <div class="flex flex-col gap-2">
                      <div>
                        <router-link
                          class="text-sm font-bold flex items-center gap-2"
                        >
                          <Avatar
                            v-if="article.author.image"
                            :image="article.author.image"
                            shape="circle"
                          />

                          <Avatar
                            v-else
                            icon="pi pi-user text-white text-xs"
                            shape="circle"
                            class="bg-[#1B4D3E]"
                          />
                          <span class="font-bold"
                            >{{ article.author.firstName }}
                            {{ article.author.lastName }}</span
                          >
                        </router-link>
                      </div>

                      <router-link
                        class="w-full"
                        :to="{
                          name: 'public-article-detail',
                          params: { title: article.title },
                        }"
                        @click="handleArticleStore(article)"
                      >
                        <h3 class="font-black text-lg">
                          {{ truncateText(article.title) }}
                        </h3>

                        <p class="text-sm">
                          {{ truncateText(article.description) }}
                        </p>
                      </router-link>
                    </div>
                  </template>
                  <template #footer>
                    <div class="mt-4 flex items-center w-full">
                      <router-link
                        class="flex items-center gap-4"
                        :to="{
                          name: 'public-article-detail',
                          params: { title: article.title },
                        }"
                        @click="handleArticleStore(article)"
                      >
                        <div class="flex gap-1 items-center">
                          <span
                            class="text-surface-500 text-sm font-normal dark:text-surface-400"
                            >{{
                              handleDateFormat(article.createdAt, "MMM DD")
                            }}</span
                          >
                        </div>

                        <div
                          class="flex gap-1 items-enter"
                          v-tooltip.top="`${article.likes} likes`"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            aria-labelledby="clap-filled-static-desc"
                            viewBox="0 0 16 16"
                            class="mt-[0.1rem]"
                          >
                            <desc id="clap-filled-static-desc">
                              A clap icon
                            </desc>
                            <path
                              fill="#6B6B6B"
                              fill-rule="evenodd"
                              d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <span class="text-sm">{{ article.likes }}</span>
                        </div>

                        <div
                          class="flex gap-1 items-center"
                          v-tooltip.top="`${article.totalComments} comments`"
                        >
                          <span class="pi pi-comments text-sm"></span>
                          <span class="text-sm">{{
                            article.totalComments
                          }}</span>
                        </div>
                      </router-link>

                      <div class="ml-auto w-28 flex justify-center">
                        <Button
                          v-if="article.isSaved"
                          v-tooltip.top="'Saved'"
                          class="text-sm"
                          icon="pi pi-bookmark-fill"
                          severity="secondary"
                          variant="text"
                          rounded
                          aria-label="Bookmark"
                          @click="removeArticleFromReadingList(article.id)"
                        />

                        <Button
                          v-else
                          v-tooltip.top="'Save'"
                          class="text-sm"
                          icon="pi pi-bookmark"
                          severity="secondary"
                          variant="text"
                          rounded
                          aria-label="Bookmark"
                          @click="addArticleToReadingList(article.id)"
                        />
                      </div>
                    </div>
                  </template>
                </Card>
              </div>

              <div>
                <Button
                  label="See more recommended stories"
                  severity="contrast"
                  variant="outlined"
                  class="text-xs"
                  rounded
                />
              </div>
            </div>

            <Divider class="py-8" />

            <div class="p-6 flex flex-col gap-8">
              <span class="text-2xl font-bold">Who to follow</span>
              <div class="grid grid-cols-5 gap-6">
                <Card
                  v-for="article in remainingArticles"
                  :key="article.id"
                  class="w-full overflow-hidden rounded-none"
                  pt:footer:class="mt-auto"
                  pt:body:class="h-full"
                >
                  <template #content>
                    <div class="flex flex-col gap-2">
                      <div>
                        <router-link
                          class="text-sm font-bold flex flex-col gap-2"
                        >
                          <Avatar
                            v-if="article.author.image"
                            :image="article.author.image"
                            shape="circle"
                            size="xlarge"
                          />

                          <Avatar
                            v-else
                            icon="pi pi-user text-white text-xs"
                            shape="circle"
                            size="xlarge"
                            class="bg-[#1B4D3E]"
                          />

                          <div class="flex flex-col gap-2">
                            <span class="font-bold text-lg"
                              >{{ article.author.firstName }}
                              {{ article.author.lastName }}</span
                            >
                            <div class="flex gap-2 text-xs font-normal">
                              <span
                                >{{ article.author?.followers }} followers</span
                              >
                            </div>
                          </div>
                        </router-link>
                      </div>

                      <router-link
                        class="w-full"
                        :to="{
                          name: 'public-article-detail',
                          params: { title: article.title },
                        }"
                        @click="handleArticleStore(article)"
                      >
                        <p class="text-sm">
                          {{ truncateText(article.description) }}
                        </p>
                      </router-link>
                    </div>
                  </template>
                  <template #footer>
                    <div class="mt-4 flex items-center w-full">
                      <Button
                        v-if="article.author.isFollowed"
                        severity="contrast"
                        variant="outlined"
                        class="text-xs w-full"
                        rounded
                        label="Following"
                        @click="removeAuthorFollower(article.author.id)"
                      />
                      <Button
                        v-else-if="
                          !article.author.isFollowed && article.author.id !== id
                        "
                        severity="contrast"
                        variant="outlined"
                        class="text-xs w-full"
                        rounded
                        label="Follow"
                        @click="addAuthorFollower(article.author.id)"
                      />
                    </div>
                  </template>
                </Card>
              </div>

              <div>
                <Button
                  label="See more"
                  severity="contrast"
                  variant="outlined"
                  class="text-xs"
                  rounded
                />
              </div>
            </div>

            <Divider class="py-8" />

            <div class="p-6 flex flex-row gap-8">
              <div class="basis-1/3">
                <span class="text-2xl font-bold">Latest stories</span>
              </div>

              <div class="basis-2/3 flex flex-col gap-6">
                <Panel
                  v-for="article in remainingArticles"
                  :key="article.id"
                  class="border relative p-2 rounded-none border-t-0 border-r-0 border-l-0"
                >
                  <template #header>
                    <div class="flex items-center gap-2">
                      <router-link
                        class="text-sm font-bold flex items-center gap-2"
                      >
                        <Avatar
                          v-if="article.author.image"
                          :image="article.author.image"
                          shape="circle"
                        />

                        <Avatar
                          v-else
                          icon="pi pi-user text-white text-xs"
                          shape="circle"
                          class="bg-[#1B4D3E]"
                        />
                        <span class="font-bold"
                          >{{ article.author.firstName }}
                          {{ article.author.lastName }}</span
                        >
                      </router-link>

                      <Button
                        v-if="article.author.isFollowed"
                        class="text-xs"
                        rounded
                        text
                        label="Following"
                        @click="removeAuthorFollower(article.author.id)"
                      />
                      <Button
                        v-else-if="
                          !article.author.isFollowed && article.author.id !== id
                        "
                        class="text-xs"
                        rounded
                        text
                        label="Follow"
                        @click="addAuthorFollower(article.author.id)"
                      />
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
                  <div class="">
                    <Card
                      pt:body:class="flex-1 p-0 m-auto"
                      class="shadow-none rounded-none items-start justify-between overflow-hidden flex-row-reverse w-full gap-4"
                    >
                      <!-- Text Content -->
                      <template #content>
                        <div class="flex flex-row w-full">
                          <div class="basis-3/4">
                            <router-link
                              class="w-full"
                              :to="{
                                name: 'public-article-detail',
                                params: { title: article.title },
                              }"
                              @click="handleArticleStore(article)"
                            >
                              <h3 class="font-black text-xl md:text-2xl">
                                {{ truncateText(article.title) }}
                              </h3>

                              <p class="text-lg">
                                {{ truncateText(article.description) }}
                              </p>
                            </router-link>

                            <div class="mt-4 flex items-center w-full">
                              <router-link
                                class="flex items-center gap-4"
                                :to="{
                                  name: 'public-article-detail',
                                  params: { title: article.title },
                                }"
                                @click="handleArticleStore(article)"
                              >
                                <div class="flex gap-1 items-center">
                                  <span
                                    class="text-surface-500 text-sm font-normal dark:text-surface-400"
                                    >{{
                                      handleDateFormat(
                                        article.createdAt,
                                        "MMM DD"
                                      )
                                    }}</span
                                  >
                                </div>

                                <div
                                  class="flex gap-1 items-enter"
                                  v-tooltip.top="`${article.likes} likes`"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    aria-labelledby="clap-filled-static-desc"
                                    viewBox="0 0 16 16"
                                    class="mt-[0.1rem]"
                                  >
                                    <desc id="clap-filled-static-desc">
                                      A clap icon
                                    </desc>
                                    <path
                                      fill="#6B6B6B"
                                      fill-rule="evenodd"
                                      d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                                      clip-rule="evenodd"
                                    ></path>
                                  </svg>
                                  <span class="text-sm">{{
                                    article.likes
                                  }}</span>
                                </div>

                                <div
                                  class="flex gap-1 items-center"
                                  v-tooltip.top="
                                    `${article.totalComments} comments`
                                  "
                                >
                                  <span class="pi pi-comments text-sm"></span>
                                  <span class="text-sm">{{
                                    article.totalComments
                                  }}</span>
                                </div>
                              </router-link>

                              <div class="ml-auto w-28 flex justify-center">
                                <Button
                                  v-if="article.isSaved"
                                  v-tooltip.top="'Saved'"
                                  class="text-sm"
                                  icon="pi pi-bookmark-fill"
                                  severity="secondary"
                                  variant="text"
                                  rounded
                                  aria-label="Bookmark"
                                  @click="
                                    removeArticleFromReadingList(article.id)
                                  "
                                />

                                <Button
                                  v-else
                                  v-tooltip.top="'Save'"
                                  class="text-sm"
                                  icon="pi pi-bookmark"
                                  severity="secondary"
                                  variant="text"
                                  rounded
                                  aria-label="Bookmark"
                                  @click="addArticleToReadingList(article.id)"
                                />
                              </div>
                            </div>
                          </div>

                          <!-- Image -->
                          <div class="basis-1/4 max-h-24">
                            <router-link
                              class="w-full"
                              :to="{
                                name: 'public-article-detail',
                                params: { title: article.title },
                              }"
                              @click="handleArticleStore(article)"
                            >
                              <img
                                v-if="article.image"
                                :src="article.image"
                                class="w-full h-full object-cover"
                              />
                              <img
                                v-else
                                src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
                                alt="Mock Negotiation"
                                class="w-full h-full object-cover bas"
                              />
                            </router-link>
                          </div>
                        </div>
                      </template>
                    </Card>
                  </div>
                </Panel>
                <div>
                  <Button
                    label="See more"
                    severity="contrast"
                    variant="outlined"
                    class="text-xs"
                    rounded
                  />
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
<script setup>
import {
  followTag,
  getArticleByTopicId,
  getRecommendedTopic,
  getAuthorReadingList,
  getFollowedAuthors,
  unfollowTag,
  getAuthorById,
  addToReadingList,
  removeFromReadingList,
} from "@/assets/js/service";
import NavBar from "../NavBar.vue";
import { onMounted, ref, watch, computed } from "vue";
import { userStore, articleStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";
import {
  describeNumberScale,
  attachArticleImage,
  handleImage,
  handleDateFormat,
  truncateText,
} from "@/assets/js/util";

const user = ref("");
const route = useRoute();
const router = useRouter();
const activeTopicId = ref(null);
const activeTopic = ref(null);
const articlesFeed = ref([]);
const isFollowTopic = ref(false);
const firstTwoArticles = ref([]);
const remainingArticles = ref([]);
const totalRecords = ref();

watch(activeTopicId, (n, o) => {
  if (o) handleActiveTopic(n);
});

const recommendedTopics = ref([]);
const fetchRecommendedTopics = async () => {
  const { data } = await getRecommendedTopic(user.value.id, 10);

  recommendedTopics.value = data.map((topic, index) => {
    topic.value = index;
    topic.route = topic.name;
    return topic;
  });

  handleActiveTopic();
};

const handleActiveTopic = async (name = route.params.name) => {
  activeTopic.value = recommendedTopics.value.find(
    (topic) => topic.name === name || topic.id === name
  );

  if (!activeTopic.value) {
    activeTopic.value = recommendedTopics.value[0];
    router.push(activeTopic.value?.route);
  }

  activeTopicId.value = activeTopic.value?.id;
  const result = await getArticleByTopicId(activeTopicId.value, user.value.id);

  const { total, values: articles } = result.data;
  const articleWithImage = await attachArticleImage(articles);

  await handleFollowedAuthors(user.value.id, articlesFeed.value);
  await handleSavedArticles(user.value.id, articlesFeed.value);

  articlesFeed.value = await attachAuthorToArticles(articleWithImage);

  firstTwoArticles.value = articlesFeed.value.slice(0, 2);
  remainingArticles.value = articlesFeed.value.slice(2);

  totalRecords.value = total;
};

const attachAuthorToArticles = (articles) => {
  return Promise.all(
    articles.map(async (article) => {
      const { data: author } = await getAuthorById(article.authorID);

      author.image = await handleImage(article.authorID);
      article = { author, ...article };
      return article;
    })
  );
};

const handleTopicFollow = async () => {
  const tagId = activeTopicId.value;
  const authorId = user.value?.id;

  activeTopic.value = !isFollowTopic.value
    ? await followTag(tagId, authorId)
    : await unfollowTag(tagId, authorId);

  isFollowTopic.value = !isFollowTopic.value;
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchRecommendedTopics();
});

const handleArticleStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};

const removeArticleFromReadingList = async (articleIdentifier) => {
  const currentUserId = user.value.id;

  const { data: removedReadingListItem } = await removeFromReadingList(
    currentUserId,
    articleIdentifier
  );

  console.log({ removedReadingListItem });

  const targetArticle = articlesFeed.value.find(
    (article) => article.id === removedReadingListItem.articleId
  );

  if (targetArticle) {
    targetArticle.isSaved = false;
  }
};

const addArticleToReadingList = async (articleIdentifier) => {
  const currentUserId = user.value.id;

  const { data: newReadingListItem } = await addToReadingList(
    currentUserId,
    articleIdentifier
  );

  const targetArticle = articlesFeed.value.find(
    (article) => article.id === newReadingListItem.articleId
  );

  if (targetArticle) {
    targetArticle.isSaved = true;
  }
};

const handleFollowedAuthors = async (userId, articles) => {
  try {
    const { data: followedAuthors = [] } = await getFollowedAuthors(userId);
    console.log({ followedAuthors });

    if (!followedAuthors.length) return;

    // Create a Set for faster lookups
    const followedAuthorIds = new Set(
      followedAuthors
        .filter((author) => author.id !== userId)
        .map((author) => author.id)
    );

    // Update articles' author.isFollowed flag
    articles.forEach((article) => {
      article.author.isFollowed = followedAuthorIds.has(article.author.id);
    });
  } catch (error) {
    console.error("Failed to fetch followed authors:", error);
  }
};

const handleSavedArticles = async (userId, articles) => {
  try {
    const { data: readingList = [] } = await getAuthorReadingList(userId);

    if (!readingList.values.length) return;

    // Create a Set for faster lookups
    const readingListAuthorIds = new Set(
      readingList.values
        .filter((list) => list.authorId === userId)
        .map((list) => list.articleId)
    );

    // Update articles' author.isSaved flag
    articles.forEach((article) => {
      article.isSaved = readingListAuthorIds.has(article.id);
    });
  } catch (error) {
    console.error("Failed to fetch followed authors:", error);
  }
};
</script>
