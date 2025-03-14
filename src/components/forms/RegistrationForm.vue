<template>
  <div class="card flex justify-center">
    <Stepper v-model:value="activeStep" class="basis-[40rem]">
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
            class="flex flex-col gap-4 p-8 rounded-xl bg-[#FBFBFB] shadow-lg"
          >
            <div class="flex flex-col mb-4">
              <span class="text-3xl font-black">Create an account</span>
              <!-- <span class="text-lg">Register now to access your account.</span> -->
            </div>
            <Form
              :resolver="resolver"
              :initialValues="initialValues"
              @submit="onFormSubmit"
              class="flex flex-col gap-4 w-full"
            >
              <div class="flex justify-between gap-4">
                <FormField
                  v-slot="$field"
                  as="section"
                  name="firstName"
                  initialValue=""
                  class="flex flex-col gap-2 text-sm"
                >
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
                  class="flex flex-col gap-2 text-sm mt-[0.20rem]"
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
                  class="flex flex-col gap-2 text-sm"
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
                  class="flex flex-col gap-2 text-sm"
                >
                  <div class="flex gap-2 items-center">
                    <label for="email">Email</label>
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
              </div>
              <FormField
                v-slot="$field"
                asChild
                name="password"
                initialValue=""
              >
                <section class="flex flex-col gap-2 text-sm">
                  <div class="flex gap-2 items-center">
                    <label for="password">Password</label>
                    <span
                      class="pi pi-asterisk text-[.5rem] text-red-600"
                    ></span>
                  </div>
                  <Password type="text" :feedback="false" toggleMask fluid />
                  <Message
                    v-if="$field?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $field.error?.message }}</Message
                  >
                </section>
              </FormField>

              <!-- <Button
              type="submit"
              icon="pi pi-user-plus"
              severity="warn"
              label="Create account"
              :loading="loading"
              raised
            /> -->

              <FormField
                as="section"
                name="forgot_password"
                initialValue=""
                class="flex justify-center items-center gap-2"
              >
                <span class="text-xs">Already have an account?</span>
                <router-link class="cursor-pointer" :to="{ name: 'login' }">
                  <span class="text-xs underline">Sign in</span>
                </router-link>
              </FormField>
            </Form>
          </div>
          <div class="flex pt-6 justify-end">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback(2)"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" :value="2" class="w-[30rem]">
          <div
            class="flex flex-col gap-4 p-8 rounded-xl bg-[#FBFBFB] shadow-lg w-full h-full m-auto"
          >
            <div class="text-2xl font-black">Choose your interests</div>
            <MultiSelect
              v-model="selectedItems"
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
              class="w-full"
            />
          </div>
          <div class="flex pt-6 justify-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback(1)"
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback(3)"
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
          <div class="flex pt-6 justify-start">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback(2)"
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script setup>
import { ref, provide } from "vue";

const image = provide("");
const src = provide("");
const activeStep = ref(1);
const selectedItems = ref();
const selectAll = ref(false);
const items = ref(
  Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i }))
);

const onSelectAllChange = (event) => {
  selectedItems.value = event.checked
    ? items.value.map((item) => item.value)
    : [];
  selectAll.value = event.checked;
};
const onChange = (event) => {
  selectAll.value = event.value.length === items.value.length;
};

import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { register } from "../../assets/js/service.js";
import { useRouter } from "vue-router";

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

const resolver = zodResolver(
  z.object({
    firstName: z.string().min(1, { message: "first name is required." }),
    username: z.string().min(1, { message: "username is required." }),
    email: z.string().min(1, { message: "email is required." }),
    password: z.string().min(1, { message: "Password is required." }),
  })
);

const onFormSubmit = async ({ valid, values }) => {
  if (valid) {
    loading.value = true;

    const { ok, result } = await register(values);

    toast.add({
      severity: ok ? "success" : "error",
      summary: result.message,
      life: 5000,
    });

    if (ok) {
      loading.value = false;

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      loading.value = false;
    }
  }
};
</script>
