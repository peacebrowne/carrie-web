<template>
  <Toast />

  <div class="flex flex-col gap-4 p-8 rounded-xl bg-[#FBFBFB] shadow-lg">
    <div class="flex flex-col gap-1 mb-3">
      <span class="text-3xl font-black">Welcome Back</span>
      <span class="text-sm">Please enter your account details</span>
    </div>

    <Form
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full sm:w-80"
    >
      <FormField
        v-slot="$field"
        as="section"
        name="username"
        initialValue=""
        class="flex flex-col gap-2 text-sm"
      >
        <label for="username">Username</label>
        <InputText type="text" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $field.error?.message }}</Message
        >
      </FormField>
      <FormField v-slot="$field" asChild name="password" initialValue="">
        <section class="flex flex-col gap-2 text-sm">
          <label for="password">Password</label>
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

      <FormField
        as="section"
        name="forgot_password"
        initialValue=""
        class="flex justify-between items-center gap-2"
      >
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="size"
            inputId="size_small"
            name="size"
            value="Small"
            size="small"
          />
          <label for="remember_me" class="text-xs">Remember me</label>
        </div>

        <router-link class="cursor-pointer" :to="{ name: 'register' }">
          <span class="text-xs underline">Forgot Password</span>
        </router-link>
      </FormField>

      <Button
        icon="pi pi-sign-in"
        type="submit"
        severity="warn"
        label="Login"
        :loading="loading"
        raised
      />

      <FormField
        as="section"
        name="forgot_password"
        initialValue=""
        class="flex justify-center items-center gap-2"
      >
        <span class="text-xs">Don't have an account?</span>
        <router-link class="cursor-pointer" :to="{ name: 'register' }">
          <span class="text-xs underline">Sign Up</span>
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
import { login } from "../../assets/js/service.js";
import { useRouter, useRoute } from "vue-router";
import { cookiesStore, userStore } from "../../stores/index.js";

const toast = useToast();
const size = ref();
const keepLoggedIn = ref(false);
const router = useRouter();
const route = useRoute();

const loading = ref(false);

const resolver = zodResolver(
  z.object({
    username: z.string().min(1, { message: "Username is required." }),
    password: z.string().min(1, { message: "Password is required." }),
  })
);

const onFormSubmit = async ({ valid, values }) => {
  if (valid) {
    loading.value = true;
    const { ok, result } = await login(values);

    toast.add({
      severity: ok ? "success" : "error",
      summary: result.message,
      life: 3000,
    });

    if (ok) {
      loading.value = false;
      setTimeout(() => {
        handleCookies(result);
        const queryString = route.fullPath.split("?")[1];
        const params = new URLSearchParams(queryString);
        const redirectPath = params.get("redirect");
        const url = redirectPath || "/";
        router.push(url);
      }, 3000);
    } else {
      loading.value = false;
    }
  }
};

const handleCookies = (result) => {
  const { setCookie, setIsAuthenticated } = cookiesStore();
  const { setUser } = userStore();

  const { data: cookie } = result;
  const [token, id] = cookie.split(":");

  setUser({ id });
  setCookie(token);
  setIsAuthenticated();
};
</script>
