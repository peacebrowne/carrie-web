<template>
  <Toast />

  <div class="card flex justify-center">
    <Stepper v-model:value="activeStep" class="basis-[40rem]" linear>
      <StepList>
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
                  'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                  {
                    'bg-primary text-primary-contrast border-primary':
                      value <= activeStep,
                    'border-surface-200 dark:border-surface-700':
                      value > activeStep,
                  },
                ]"
              >
                <i class="pi pi-user" />
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
                  'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                  {
                    'bg-primary text-primary-contrast border-primary':
                      value <= activeStep,
                    'border-surface-200 dark:border-surface-700':
                      value > activeStep,
                  },
                ]"
              >
                <i class="pi pi-star" />
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
                  'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                  {
                    'bg-primary text-primary-contrast border-primary':
                      value <= activeStep,
                    'border-surface-200 dark:border-surface-700':
                      value > activeStep,
                  },
                ]"
              >
                <i class="pi pi-id-card" />
              </span>
            </button>
          </div>
        </Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" :value="1" class="w-[30rem]">
          <div
            class="flex flex-col gap-2 p-6 rounded-xl bg-[#FBFBFB] shadow-lg"
          >
            <div class="flex flex-col mb-4">
              <span class="text-3xl font-black">Create an account</span>
              <!-- <span class="text-lg">Register now to access your account.</span> -->
            </div>

            <Form
              ref="formRef"
              :resolver="resolver"
              :initialValues="initialValues"
              class="flex flex-col gap-3 w-full"
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
                  <InputText type="text" />
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
                  <InputText type="text" />
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
                  <InputText type="text" />
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
                  <InputText type="email" />
                  <Message
                    v-if="$field?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $field.error?.message }}</Message
                  >
                </FormField>
              </div>
              <FormField
                v-slot="$field"
                asChild
                name="password"
                initialValue=""
                autocomplete
              >
                <section
                  class="flex flex-col gap-2 text-sm"
                  aria-autocomplete="true"
                >
                  <div class="flex gap-2 items-center">
                    <label for="password">Password</label>
                    <span
                      class="pi pi-asterisk text-[.5rem] text-red-600"
                    ></span>
                  </div>
                  <Password
                    type="password"
                    :feedback="false"
                    toggleMask
                    fluid
                    autocomplete
                  />
                  <Message
                    v-if="$field?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $field.error?.message }}</Message
                  >
                </section>
              </FormField>

              <div
                as="section"
                initialValue=""
                class="flex justify-center items-center gap-2"
              >
                <span class="text-xs">Already have an account?</span>
                <router-link class="cursor-pointer" :to="{ name: 'login' }">
                  <span class="text-xs underline">Sign in</span>
                </router-link>
              </div>
            </Form>
          </div>
          <div class="flex pt-6 justify-end">
            <Button
              label="Next"
              icon="pi pi-arrow-right text-xs"
              iconPos="right"
              @click="validateStepOne(activateCallback)"
              class="py-1"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" :value="2" class="w-[30rem]">
          <div
            class="flex flex-col gap-4 p-8 rounded-xl bg-[#FBFBFB] shadow-lg w-full h-full m-auto"
          >
            <div class="text-2xl font-black">Choose your interests</div>

            <MultiSelect
              v-model="interests"
              :options="items"
              :maxSelectedLabels="3"
              :selectAll="selectAll"
              optionLabel="label"
              optionValue="value"
              @selectall-change="onSelectAllChange($event)"
              @change="onChange($event)"
              :virtualScrollerOptions="{ itemSize: 44 }"
              filter
              placeholder="Select Item"
              class="w-full md:w-80"
            />
          </div>
          <div class="flex pt-6 justify-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left text-xs"
              @click="activateCallback(1)"
              class="py-1"
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right text-xs"
              iconPos="right"
              @click="activateCallback(3)"
              class="py-1"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" :value="3" class="w-[30rem]">
          <div
            class="flex flex-col gap-4 p-8 rounded-xl bg-[#FBFBFB] shadow-lg w-full h-full m-auto"
          >
            <div class="text-2xl font-black">Add profile picture</div>
            <div class="text-center">
              <AddImage name="image" v-model:src="src" v-model:image="image" />
            </div>
          </div>
          <div class="flex pt-6 justify-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left text-xs"
              @click="activateCallback(2)"
              class="py-1"
            />

            <Button
              type="submit"
              icon="pi pi-user-plus text-xs"
              severity="warn"
              label="Create account"
              :loading="loading"
              class="py-1"
              raised
              @click="onFormSubmit"
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
