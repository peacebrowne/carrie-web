<template>
  <Toast />

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
          <div class="flex flex-col">
            <span class="text-4xl font-bold"
              >{{ author.firstName }} {{ author.lastName }}</span
            >
            <span>{{ author.email }}</span>
          </div>
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
            @click="handleUserProfile"
          />

          <Dialog
            v-model:visible="showProfile"
            modal
            header="Edit Profile"
            :style="{ width: '50rem' }"
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
                  <!-- FIRST NAME -->
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="firstName"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-[50%]"
                  >
                    <div class="flex gap-2 items-center">
                      <label for="firstName" class="font-bold"
                        >First name</label
                      >
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

                  <!-- LAST NAME -->
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="lastName"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm mt-[0.22rem] w-[50%]"
                  >
                    <label for="lastName" class="font-bold">Last name</label>
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
                  <!-- USERNAME -->
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="username"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-[50%]"
                  >
                    <div class="flex gap-2 items-center">
                      <label for="username" class="font-bold">Username</label>
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

                  <!-- EMAIL -->
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="email"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-[50%]"
                  >
                    <div class="flex gap-2 items-center">
                      <label for="email" class="font-bold">Email</label>
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
                  <!-- CONTACT -->
                  <div class="flex flex-col gap-2 text-sm w-[50%]">
                    <label for="msisdn" class="font-bold">Contact</label>
                    <div class="flex items-center">
                      <Select
                        v-model="selectedCountry"
                        :options="countries"
                        optionLabel="countryNameEn"
                        filter
                        :virtualScrollerOptions="{ itemSize: 44 }"
                        id="contact"
                        class="p-[0.34rem]"
                      >
                        <!-- Selected Value -->
                        <template #value="slotProps">
                          <div class="flex items-center" v-if="slotProps.value">
                            <div class="flex items-center gap-1 text-xs">
                              <span>{{ slotProps.value.flag }}</span>
                              <div class="flex items-center">
                                <i class="pi pi-plus !text-[9px]"></i
                                >{{ slotProps.value.countryCallingCode }}
                              </div>
                            </div>
                          </div>
                          <span v-else class="text-gray-400"
                            >Select country</span
                          >
                        </template>

                        <!-- Option in Dropdown -->
                        <template #option="slotProps">
                          <div
                            class="flex items-center w-full justify-between text-xs"
                          >
                            <div class="flex items-center gap-1">
                              <span>{{ slotProps.option.flag }}</span>
                              <span>{{ slotProps.option.countryNameEn }}</span>
                            </div>
                            <div class="flex items-center font-black">
                              <i class="pi pi-plus !text-[9px]"></i
                              >{{ slotProps.option.countryCallingCode }}
                            </div>
                          </div>
                        </template>
                      </Select>
                      <FormField
                        as="section"
                        class="w-full"
                        name="msisdn"
                        v-slot="$field"
                        initialValue=""
                      >
                        <div class="flex w-full">
                          <InputText
                            class="w-full"
                            type="tel"
                            v-bind="$field"
                          />
                        </div>
                      </FormField>
                    </div>
                  </div>

                  <!-- GENDER -->
                  <FormField
                    as="section"
                    class="flex flex-col gap-2 text-sm w-[50%]"
                    name="gender"
                    v-slot="{ value, handleChange, error, invalid }"
                    :initialValue="''"
                  >
                    <label for="gender" class="font-bold">Gender</label>
                    <div class="flex flex-col gap-1">
                      <Select
                        :options="genders"
                        placeholder="Select a Gender"
                        fluid
                        :modelValue="value"
                        @update:modelValue="handleChange"
                        checkmark
                      />
                      <Message
                        v-if="invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                      >
                        {{ error?.message }}
                      </Message>
                    </div>
                  </FormField>
                </div>

                <div class="flex justify-between gap-4">
                  <!-- DATE OF BIRTH -->
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="dob"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-[50%]"
                  >
                    <div class="flex gap-2">
                      <label for="dob" class="font-bold">Date of birth</label>
                    </div>
                    <InputText type="date" v-bind="$field" />
                  </FormField>

                  <!-- INTERESTS -->
                  <FormField
                    as="section"
                    class="flex flex-col gap-2 text-sm w-[50%]"
                    name="interests"
                    v-slot="{ value, handleChange }"
                    :initialValue="[]"
                  >
                    <label for="interests" class="font-bold"
                      >Select your interest</label
                    >
                    <MultiSelect
                      :options="interests"
                      :maxSelectedLabels="5"
                      :modelValue="value"
                      @update:modelValue="handleChange"
                      :selectAll="false"
                      :selectionLimit="5"
                      :virtualScrollerOptions="{ itemSize: 44 }"
                      filter
                    />
                  </FormField>
                </div>

                <div class="flex flex-col justify-between gap-4">
                  <!-- ADDRESS -->
                  <FormField
                    v-slot="$field"
                    as="section"
                    name="address"
                    initialValue=""
                    class="flex flex-col gap-2 text-sm w-full"
                  >
                    <div class="flex gap-2">
                      <label for="address" class="font-bold">Address</label>
                    </div>
                    <InputText type="address" v-bind="$field" />
                  </FormField>

                  <!-- BIOGRAPHY -->
                  <FormField name="biography">
                    <div class="flex flex-col gap-2">
                      <label for="biography" class="font-bold">Biography</label>
                      <Editor
                        id="editor"
                        class="border w-full rounded-lg"
                        :editorData="editorData"
                      />
                    </div>
                  </FormField>
                </div>

                <div class="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                    class="py-1 text-sm flex items-center"
                    raised
                    @click="showProfile = false"
                  />
                  <Button
                    type="submit"
                    severity="warn"
                    label="Submit"
                    icon="pi pi-check text-sm"
                    class="py-1 text-xs flex items-center"
                    :loading="loading"
                    raised
                  />
                </div>
              </Form>
            </div>
          </Dialog>
        </div>
        <div class="flex gap-4 border rounded-2xl p-6">
          <div>
            <span class="font-black text-lg">Personal Information</span>
            <div class="flex gap-6">
              <ul class="flex flex-col gap-3 !p-0">
                <li v-if="author.username" class="flex flex-col">
                  <span class="text-xs">Username</span>
                  <span class="font-bold text-sm">{{ author.username }}</span>
                </li>
                <li v-if="author.dob" class="flex flex-col">
                  <span class="text-xs">Date of birth</span>
                  <span class="font-bold text-sm">{{ author.dob }}</span>
                </li>
              </ul>
              <ul class="flex flex-col gap-3 !p-0">
                <li v-if="author.gender" class="flex flex-col">
                  <span class="text-xs">Gender</span>
                  <span class="font-bold text-sm">{{ author.gender }}</span>
                </li>
              </ul>
            </div>
          </div>
          <Divider layout="vertical" />

          <div>
            <span class="font-black text-lg">Others</span>
            <div class="flex gap-6">
              <ul class="flex flex-col gap-3 !p-0">
                <li v-if="author.address" class="flex flex-col">
                  <span class="text-sm">Address</span>
                  <span class="font-bold text-sm">{{ author.address }}</span>
                </li>
                <li v-if="author.msisdn" class="flex flex-col">
                  <span class="text-sm">Contact</span>
                  <span class="font-bold text-sm">{{ author.msisdn }}</span>
                </li>
                <li class="flex flex-col">
                  <span class="text-sm">Interests</span>
                  <div class="flex flex-wrap gap-1">
                    <Tag
                      v-for="interest in author.interests"
                      :key="interest"
                      :value="interest"
                      severity="contrast"
                      rounded
                      class="py-1 text-xs"
                    ></Tag>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-between w-full gap-3">
          <span class="text-2xl font-black">Biography</span>
          <p class="font-bold text-sm m-0" v-html="author.biography"></p>
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
import { ref, reactive, onMounted, provide } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { userStore } from "@/stores";
import { addImage, editAuthor, getInterests } from "@/assets/js/service";
import Editor from "../editors/ArticleEditor.vue";
import AddImage from "../articles/AddImage.vue";
import * as countryCodes from "country-codes-list";

const author = ref("");
const loading = ref(false);
const src = defineModel("src");
const image = defineModel("image");
const showProfilePicture = ref(false);
const showProfile = ref(false);
const formRef = ref(null);
const toast = useToast();
const content = defineModel("content");
provide("content", content);

const initialValues = reactive({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  msisdn: "",
  address: "",
  biography: "",
  gender: "",
  dob: "",
  interests: [],
});

const resolver = ref(
  zodResolver(
    z.object({
      firstName: z.string().min(1, { message: "First name is required." }),
      username: z.string().min(1, { message: "Username is required." }),
      email: z.string().min(1, { message: "Email is required." }),
      lastName: z.string().optional().or(z.literal("")),
      msisdn: z.string().optional().or(z.literal("")),
      address: z.string().optional().or(z.literal("")),
      biography: z.string().optional().or(z.literal("")),
      dob: z.string().optional().or(z.literal("")),
      interests: z.array(z.string()).default([]),
      gender: z.string().min(1, { message: "Gender is required." }),
    })
  )
);

const genders = ["Male", "Female"];

const onFormSubmit = async ({ valid, values }) => {
  if (!valid) return;

  loading.value = true;
  formatMsisdn(values);

  const { ok, result } = await editAuthor(author.value.id, values);
  author.value = values;
  author.value.id = user.value.id;

  toast.add({
    severity: ok ? "success" : "error",
    summary: result?.message,
    life: 10000,
  });

  if (ok) {
    showProfile.value = false;
  }

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

const handleUserProfile = () => {
  showProfile.value = true;

  setTimeout(async () => {
    const form = await formRef.value.states;

    form.firstName.value = author.value.firstName ?? "";
    form.lastName.value = author.value.lastName ?? "";
    form.username.value = author.value.username ?? "";
    form.email.value = author.value.email ?? "";
    form.msisdn.value = handleMsisdn(author.value.msisdn) ?? "";
    form.address.value = author.value.address ?? "";
    form.biography.value = author.value.biography ?? "";
    form.dob.value = author.value.dob ?? "";
    form.gender.value = author.value.gender ?? "";
    form.interests.value = Array.isArray(author.value.interests)
      ? author.value.interests
      : [];

    content.value = author.value.biography ?? "";
  }, 1000);
};

const formatMsisdn = (values) => {
  if (values.msisdn) {
    const formattedContact = values.msisdn.split(/[,;:\+\- ]+/).join("");
    console.log(selectedCountry.value);
    const contact = `${selectedCountry.value.flag} +${selectedCountry.value.countryCallingCode}-${formattedContact}`;
    values.msisdn = contact;
  }
};

const handleMsisdn = (contact) => {
  const [flag, code, tel] = contact.split(/[ \-]/);
  selectedCountry.value = countries.value.find(
    (country) => country.flag === flag
  );
  return tel;
};

const editorData = ref({
  height: "220",
  placeholder: "Add your bio to highlight your expertise and achievements.",
  name: "biography",
});

const interests = ref([]);

const selectedCountry = ref(countryCodes.all()[0]);
console.log(selectedCountry.value);
const countries = ref(countryCodes.all());

const user = ref();
onMounted(async () => {
  const { data } = await getInterests();
  interests.value = data.map((d) => d.name);

  const { getUser } = userStore();
  user.value = await getUser();
  author.value = user.value;

  // ensure interests is array of strings
  author.value.interests = Array.isArray(author.value.interests)
    ? author.value.interests
    : [];

  src.value = author.value.image;
  image.value = author.value.image;
});
</script>

<style>
#contact span {
  padding: 0 !important;
}
</style>
