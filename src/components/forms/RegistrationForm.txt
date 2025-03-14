<template>
  <Toast />

  <div class="flex flex-col gap-4 p-8 rounded-xl bg-[#FBFBFB] shadow-lg">
    <div class="flex flex-col gap-2 mb-4">
      <span class="text-4xl font-black">Create an account</span>
      <span class="text-lg">Register now to access your account.</span>
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
            <span class="pi pi-asterisk text-[.5rem] text-red-600"></span>
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
            <span class="pi pi-asterisk text-[.5rem] text-red-600"></span>
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
            <span class="pi pi-asterisk text-[.5rem] text-red-600"></span>
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
      <FormField v-slot="$field" asChild name="password" initialValue="">
        <section class="flex flex-col gap-2 text-sm">
          <div class="flex gap-2 items-center">
            <label for="password">Password</label>
            <span class="pi pi-asterisk text-[.5rem] text-red-600"></span>
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

      <Button
        type="submit"
        icon="pi pi-user-plus"
        severity="warn"
        label="Create account"
        :loading="loading"
        raised
      />

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
</template>

<script setup>
import { ref } from "vue";
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
