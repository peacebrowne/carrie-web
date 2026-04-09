<template>
  <Toast />

  <div class="card flex justify-center p-2 sm:p-4">
    <Stepper v-model:value="activeStep" class="w-full max-w-[45rem]" linear>
      <StepList class="overflow-x-auto">
        <Step
          v-slot="{ activateCallback, value, a11yAttrs }"
          asChild
          :value="1"
        >
          <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
            <button
              class="bg-transparent border-0 inline-flex flex-col gap-2"
              @click="activateCallback"
              v-bind="a11yAttrs.header"
            >
              <span
                :class="[
                  'rounded-full border-2 w-10 h-10 md:w-12 md:h-12 inline-flex items-center justify-center transition-colors',
                  value <= activeStep
                    ? 'bg-primary text-primary-contrast border-primary'
                    : 'border-surface-200 dark:border-surface-700',
                ]"
              >
                <i class="pi pi-user text-sm md:text-base" />
              </span>
            </button>
            <Divider />
          </div>
        </Step>

        <Step
          v-slot="{ activateCallback, value, a11yAttrs }"
          asChild
          :value="2"
        >
          <div
            class="flex flex-row flex-auto gap-2 pl-2"
            v-bind="a11yAttrs.root"
          >
            <button
              class="bg-transparent border-0 inline-flex flex-col gap-2"
              @click="activateCallback"
              v-bind="a11yAttrs.header"
            >
              <span
                :class="[
                  'rounded-full border-2 w-10 h-10 md:w-12 md:h-12 inline-flex items-center justify-center transition-colors',
                  value <= activeStep
                    ? 'bg-primary text-primary-contrast border-primary'
                    : 'border-surface-200 dark:border-surface-700',
                ]"
              >
                <i class="pi pi-star text-sm md:text-base" />
              </span>
            </button>
            <Divider />
          </div>
        </Step>

        <Step
          v-slot="{ activateCallback, value, a11yAttrs }"
          asChild
          :value="3"
        >
          <div class="flex flex-row pl-2" v-bind="a11yAttrs.root">
            <button
              class="bg-transparent border-0 inline-flex flex-col gap-2"
              @click="activateCallback"
              v-bind="a11yAttrs.header"
            >
              <span
                :class="[
                  'rounded-full border-2 w-10 h-10 md:w-12 md:h-12 inline-flex items-center justify-center transition-colors',
                  value <= activeStep
                    ? 'bg-primary text-primary-contrast border-primary'
                    : 'border-surface-200 dark:border-surface-700',
                ]"
              >
                <i class="pi pi-id-card text-sm md:text-base" />
              </span>
            </button>
          </div>
        </Step>
      </StepList>

      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" :value="1" class="w-full">
          <div
            class="flex flex-col gap-2 p-4 md:p-6 rounded-xl bg-[#FBFBFB] shadow-lg"
          >
            <div class="flex flex-col mb-4">
              <span
                class="text-2xl md:text-3xl font-black text-center md:text-left"
                >Create an account</span
              >
            </div>

            <Form
              ref="formRef"
              :resolver="resolver"
              :initialValues="initialValues"
              class="flex flex-col gap-3 w-full"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  v-slot="$field"
                  as="section"
                  name="firstName"
                  class="flex flex-col gap-2 text-sm"
                >
                  <div class="flex gap-2 items-center">
                    <label for="firstName" class="font-semibold"
                      >First name</label
                    >
                    <span
                      class="pi pi-asterisk text-[.5rem] text-red-600"
                    ></span>
                  </div>
                  <InputText type="text" class="w-full" />
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
                  class="flex flex-col gap-2 text-sm"
                >
                  <label for="lastName" class="font-semibold">Last name</label>
                  <InputText type="text" class="w-full" />
                  <Message
                    v-if="$field?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $field.error?.message }}</Message
                  >
                </FormField>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  v-slot="$field"
                  as="section"
                  name="username"
                  class="flex flex-col gap-2 text-sm"
                >
                  <div class="flex gap-2 items-center">
                    <label for="username" class="font-semibold">Username</label>
                    <span
                      class="pi pi-asterisk text-[.5rem] text-red-600"
                    ></span>
                  </div>
                  <InputText type="text" class="w-full" />
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
                  class="flex flex-col gap-2 text-sm"
                >
                  <div class="flex gap-2 items-center">
                    <label for="email" class="font-semibold">Email</label>
                    <span
                      class="pi pi-asterisk text-[.5rem] text-red-600"
                    ></span>
                  </div>
                  <InputText type="email" class="w-full" />
                  <Message
                    v-if="$field?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $field.error?.message }}</Message
                  >
                </FormField>
              </div>

              <FormField v-slot="$field" asChild name="password" autocomplete>
                <section class="flex flex-col gap-2 text-sm">
                  <div class="flex gap-2 items-center">
                    <label for="password" class="font-semibold">Password</label>
                    <span
                      class="pi pi-asterisk text-[.5rem] text-red-600"
                    ></span>
                  </div>
                  <Password :feedback="false" toggleMask fluid autocomplete />
                  <Message
                    v-if="$field?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $field.error?.message }}</Message
                  >
                </section>
              </FormField>

              <div class="flex justify-center items-center gap-2 mt-2">
                <span class="text-xs">Already have an account?</span>
                <router-link :to="{ name: 'login' }">
                  <span class="text-xs underline font-bold">Sign in</span>
                </router-link>
              </div>
            </Form>
          </div>
          <div class="flex pt-6 justify-end">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="validateStepOne(activateCallback)"
              class="w-full md:w-auto"
            />
          </div>
        </StepPanel>

        <StepPanel v-slot="{ activateCallback }" :value="2" class="w-full">
          <div
            class="flex flex-col gap-4 p-6 md:p-8 rounded-xl bg-[#FBFBFB] shadow-lg w-full"
          >
            <div class="text-2xl font-black text-center md:text-left">
              Choose your interests
            </div>
            <MultiSelect
              v-model="interests"
              :options="items"
              optionLabel="label"
              optionValue="value"
              placeholder="Select Interests"
              class="w-full"
              fluid
            />
          </div>
          <div class="flex flex-col md:flex-row pt-6 gap-3">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback(1)"
              class="w-full md:w-auto order-2 md:order-1"
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback(3)"
              class="w-full md:w-auto order-1 md:order-2 md:ml-auto"
            />
          </div>
        </StepPanel>

        <StepPanel v-slot="{ activateCallback }" :value="3" class="w-full">
          <div
            class="flex flex-col gap-4 p-6 md:p-8 rounded-xl bg-[#FBFBFB] shadow-lg w-full"
          >
            <div class="text-2xl font-black text-center md:text-left">
              Add profile picture
            </div>
            <div class="flex justify-center py-4">
              <AddImage
                name="image"
                v-model:src="src"
                v-model:image="image"
                class="max-w-full"
              />
            </div>
          </div>
          <div class="flex flex-col md:flex-row pt-6 gap-3">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback(2)"
              class="w-full md:w-auto order-2 md:order-1"
            />
            <Button
              type="submit"
              severity="warn"
              label="Create account"
              :loading="loading"
              raised
              @click="onFormSubmit"
              class="w-full md:w-auto order-1 md:order-2 md:ml-auto"
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { getInterests, register } from "@/assets/js/service";
import { useRouter } from "vue-router";

const image = defineModel("image");
const src = defineModel("src");
const interests = ref();
const activeStep = ref(1);
const formRef = ref(null);
const selectAll = ref(false);
const items = ref([]);
const toast = useToast();
const router = useRouter();

const loading = ref(false);

const initialValues = ref({
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const validateStepOne = async (next) => {
  const { errors } = await formRef.value.validate();

  const error = Object.keys(errors).length;

  if (!error) {
    next(2);
  }
};

const onSelectAllChange = (event) => {
  interests.value = event.checked ? items.value.map((item) => item.value) : [];
  selectAll.value = event.checked;
};

const onChange = (event) => {
  selectAll.value = event.value.length === items.value.length;
};

const fetchInterests = async () => {
  const { data } = await getInterests();
  items.value = data.map((item) => ({ label: item.name, value: item.id }));
};

onMounted(async () => await fetchInterests());

const resolver = zodResolver(
  z.object({
    firstName: z.string().min(1, { message: "First name is required." }),
    username: z.string().min(1, { message: "Username is required." }),
    email: z.string().min(1, { message: "Email is required." }),
    password: z.string().min(1, { message: "Password is required." }),
  })
);

const handleAuthorData = ({ states }) => {
  return {
    username: states.username.value,
    firstName: states.firstName.value,
    lastName: states.lastName.value,
    email: states.email.value,
    password: states.password.value,
    interests: interests.value.map(
      (interest) => items.value.find((item) => item.value === interest).label
    ),
  };
};

const onFormSubmit = async () => {
  const author = handleAuthorData(formRef.value);

  const data = new FormData();
  data.append("image", image.value);
  data.append(
    "author",
    new Blob([JSON.stringify(author)], { type: "application/json" })
  );

  loading.value = true;
  const { ok, result } = await register(data);

  toast.add({
    severity: ok ? "success" : "error",
    summary: result.message,
    life: 5000,
  });

  if (ok) {
    loading.value = false;
    setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
  } else {
    loading.value = false;
  }
};
</script>
