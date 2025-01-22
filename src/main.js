import Button from "primevue/button";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import StyleClass from "primevue/styleclass";
import Editor from "primevue/editor";
import FloatLabel from "primevue/floatlabel";
import Toast from "primevue/toast";
import ToggleSwitch from "primevue/toggleswitch";

import Image from "primevue/image";

import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "primeicons/primeicons.css";

import ConfirmationService from "primevue/confirmationservice";
import DialogService from "primevue/dialogservice";
import ToastService from "primevue/toastservice";

import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "./assets/tailwind.css";
import "./style.css";

const app = createApp(App);
app.use(router);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

app.component("InputText", InputText);
app.component("Button", Button);
app.component("Editor", Editor);
app.component("FloatLabel", FloatLabel);
app.component("Toast", Toast);
app.component("ToggleSwitch", ToggleSwitch);
app.use(PrimeVue, { theme: "none" });
app.directive("styleclass", StyleClass);

app.mount("#app");
