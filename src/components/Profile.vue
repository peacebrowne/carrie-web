<template>
  <div class="container m-auto flex w-full h-full">
    <div class="flex-1 flex flex-col gap-4 mx-auto h-full py-8 pr-8">
      <div class="flex items-center justify-between w-full gap-4 x">
        <div class="flex items-center gap-4">
          <div class="relative">
            <Avatar
              v-if="src"
              :image="src"
              class="mr-2"
              size="xlarge"
              shape="circle"
            />
            <Avatar
              v-else
              icon="pi pi-user"
              class="mr-2 border"
              size="xlarge"
              shape="circle"
            />

            <Button
              class="absolute bottom-0 right-0 w-[2rem] !h-[2rem] border"
              icon="pi pi-camera text-lg"
              severity="secondary"
              rounded
              raised
              aria-label="Camera"
              @click="showProfilePicture = true"
            />

            <!-- UPDATE PROFILE PICTURE -->
            <Dialog
              v-model:visible="showProfilePicture"
              modal
              header="Upload Profile Picture"
              :style="{ width: '40rem' }"
            >
              <div>
                <AddImage v-model:image="image" v-model:src="src" />
              </div>

              <div class="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  label="Cancel"
                  severity="secondary"
                  class="py-1 text-sm flex items-center"
                  @click="showProfilePicture = false"
                ></Button>
                <Button
                  type="button"
                  label="Upload"
                  :loading="loading"
                  class="py-1 text-sm flex items-center"
                  @click="uploadProfilePicture"
                ></Button>
              </div>
            </Dialog>
          </div>

          <span class="text-4xl font-bold"
            >{{ author.firstName }} {{ author.lastName }}</span
          >
        </div>
      </div>
      <div class="py-4 flex flex-col gap-3">
        <div class="flex justify-between w-ful items-center">
          <span class="text-2xl font-black">Author</span>
          <Button
            icon="pi pi-pencil text-xs"
            label="Edit profile"
            rounded
            variant="outlined"
            aria-label="Pencil"
            severity="secondary"
            class="py-1 text-sm"
            @click="handleProfile"
          />

          <Dialog
            v-model:visible="showProfile"
            modal
            header="Edit Profile"
            :style="{ width: '40rem' }"
          >
            <div>
              <Form
                :resolver="resolver"
                :initialValues="initialValues"
                @submit="onFormSubmit"
                class="flex flex-col gap-3 w-full"
                ref="formRef"
              >
                <div class="flex justify-between gap-4">
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="firstName"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-[50%]"
                  >
                    <!-- <pre class="whitespace-pre-wrap">{{ $field }}</pre> -->
                    <div class="flex gap-2 items-center">
                      <label for="firstName">First name</label>
                      <span
                        class="pi pi-asterisk text-[.5rem] text-red-600"
                      ></span>
                    </div>
                    <InputText type="text" v-bind="$field" />
                    <Message
                      v-if="$field?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{ $field.error?.message }}</Message
                    >
                  </FormField>
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="lastName"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm mt-[0.22rem] w-[50%]"
                  >
                    <label for="lastName">Last name</label>
                    <InputText type="text" v-bind="$field" />
                    <Message
                      v-if="$field?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{ $field.error?.message }}</Message
                    >
                  </FormField>
                </div>
                <div class="flex justify-between gap-4">
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="username"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-[50%]"
                  >
                    <div class="flex gap-2 items-center">
                      <label for="username">Username</label>
                      <span
                        class="pi pi-asterisk text-[.5rem] text-red-600"
                      ></span>
                    </div>
                    <InputText type="text" v-bind="$field" />
                    <Message
                      v-if="$field?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{ $field.error?.message }}</Message
                    >
                  </FormField>
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="email"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-[50%]"
                  >
                    <div class="flex gap-2 items-center">
                      <label for="email">Email</label>
                      <span
                        class="pi pi-asterisk text-[.5rem] text-red-600"
                      ></span>
                    </div>
                    <InputText type="email" v-bind="$field" />
                    <Message
                      v-if="$field?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{ $field.error?.message }}</Message
                    >
                  </FormField>
                </div>

                <div class="flex justify-between gap-4">
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="msisdn"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-[50%]"
                  >
                    <div class="flex gap-2 items-center">
                      <label for="msisdn">Contact</label>
                    </div>

                    <div class="flex">
                      <Select
                        v-model="selectedCity"
                        :options="cities"
                        optionLabel="name"
                        placeholder="+86"
                        class="md:w-20"
                      />

                      <InputText type="text" v-bind="$field" />
                    </div>
                  </FormField>
                  <FormField
                    as="section"
                    name="address"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-[50%]"
                  >
                    <div class="flex gap-2">
                      <label for="address">Address</label>
                    </div>
                    <InputText type="address" />
                  </FormField>
                </div>

                <FormField name="biography">
                  <div class="flex flex-col gap-2">
                    <label for="biography">Biography</label>
                    <Editor class="border w-full rounded-lg" />
                  </div>
                </FormField>
              </Form>
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                label="Cancel"
                severity="secondary"
                class="py-1 text-sm flex items-center"
                @click="showProfile = false"
              ></Button>
              <Button
                type="button"
                label="Submit"
                :loading="loading"
                class="py-1 text-sm flex items-center"
                @click="uploadProfilePicture"
              ></Button>
            </div>
          </Dialog>
        </div>
        <div class="flex gap-4 border rounded-2xl p-6">
          <div>
            <span class="font-black text-lg">Personal Information</span>
            <div class="flex gap-6 pt-3">
              <ul class="flex flex-col gap-3">
                <li class="flex flex-col">
                  <span class="text-sm">Full Name</span>
                  <span class="font-bold text-sm"
                    >{{ author.firstName }} {{ author.lastName }}</span
                  >
                </li>
                <li class="flex flex-col">
                  <span class="text-sm">Email</span>
                  <span class="font-bold text-sm">{{ author.email }}</span>
                </li>
              </ul>
              <ul>
                <li class="flex flex-col">
                  <span class="text-sm">Username</span>
                  <span class="font-bold text-sm">{{ author.username }}</span>
                </li>
              </ul>
            </div>
          </div>
          <Divider layout="vertical" />

          <div>
            <span class="font-bold text-lg">Location</span>
            <div class="flex gap-6 pt-3">
              <ul class="flex flex-col gap-3">
                <li class="flex flex-col">
                  <span class="text-sm">Address</span>
                  <span class="font-bold text-sm"
                    >Wolog Rd. 1368 Nanyang, Henan, China</span
                  >
                </li>
                <li class="flex flex-col">
                  <span class="text-sm">Contact</span>
                  <span class="font-bold text-sm">+86 123-456</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="py-4 flex flex-col gap-3">
        <span class="text-2xl font-black">Default theme</span>

        <div class="relative rounded-2xl">
          <Image
            src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg"
            alt="Image"
            class="w-full h-80 rounded-2xl"
            imageClass="w-full h-full object-cover rounded-2xl"
            preview
          />

          <Button
            icon="pi pi-camera text-xs"
            label="Edit theme"
            rounded
            aria-label="Filter"
            severity="contrast"
            class="py-1 text-sm absolute bottom-6 right-4"
          />
        </div>
      </div>
    </div>
    <Divider layout="vertical" />
    <div class="w-72 p-8"></div>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { ref, reactive, watch, onMounted, provide } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { authorStore } from "@/stores";
import { getImage, addImage } from "@/assets/js/service";
import AddImage from "./articles/AddImage.vue";
import Editor from "./articles/Editor.vue";
import * as countryCodes from "country-codes-list";

const author = ref("");
const loading = ref(false);
const src = defineModel("src");
const image = defineModel("image");
const showProfilePicture = ref(false);
const showProfile = ref(false);
const formRef = ref(null);

const fetchUserImage = async (id) => {
  if (id) {
    const { data, ok } = await getImage(id);

    if (ok && data.size) {
      return URL.createObjectURL(data);
    }
  }
};

console.log(countryCodes.all()[0]);

const initialValues = reactive({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  msisdn: "",
  address: "",
});

const resolver = ref(
  zodResolver(
    z.object({
      firstName: z.string().min(1, { message: "First name is required." }),
      username: z.string().min(1, { message: "Username is required." }),
      email: z.string().min(1, { message: "Email is required." }),
    })
  )
);

onMounted(async () => {
  const { getAuthor } = authorStore();
  author.value = await getAuthor();
  src.value = await fetchUserImage(localStorage.getItem("app-author-id"));
  image.value = src.value;
});

const onFormSubmit = async ({ valid, values }) => {
  if (!valid) return;

  loading.value = true;

  const data = new FormData();

  data.append("image", image.value);
  data.append(
    "article",
    new Blob([JSON.stringify(handleArticleData(values))], {
      type: "application/json",
    })
  );

  const { ok, result } = route.path.split("/").includes("edit")
    ? await editArticle(localStorage.getItem("app-article-id"), data)
    : await addArticle(data);

  // const { ok, result } = await addArticle(data);

  toast.add({
    severity: ok ? "success" : "error",
    summary: result?.message,
    life: 10000,
  });

  loading.value = false;
};

const uploadProfilePicture = async () => {
  showProfilePicture.value = false;

  const data = new FormData();
  data.append("img", image.value);

  const { ok, result } = await addImage(author.value?.id, data, "author");

  image.value = src.value;
  if (ok && result.size) {
    image.value = URL.createObjectURL(result);
    src.value = image.value;
  }
};

const handleProfile = () => {
  showProfile.value = true;

  setTimeout(async () => {
    const form = await formRef.value.states;

    form.firstName.value = author.value.firstName;
    form.lastName.value = author.value.lastName;
    form.username.value = author.value.username;
    form.email.value = author.value.email;
    form.msisdn.value = author.value.msisdn;
    form.address.value = author.value.address;
  }, 1000);
};

const selectedCity = ref();
const cities = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);

// console.log(countryCodes.all());
</script>

<style scoped></style>
