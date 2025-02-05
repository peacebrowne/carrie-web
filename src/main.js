import PrimeVue from "primevue/config";
import StyleClass from "primevue/styleclass";
// import Button from "primevue/button";
// import InputText from "primevue/inputtext";
import Editor from "primevue/editor";
// import FloatLabel from "primevue/floatlabel";
// import Toast from "primevue/toast";
// import ToggleSwitch from "primevue/toggleswitch";

import Fieldset from "primevue/fieldset";

// import "quill/dist/quill.core.css";
// import "quill/dist/quill.bubble.css";
import "primeicons/primeicons.css";

import ConfirmationService from "primevue/confirmationservice";
import DialogService from "primevue/dialogservice";
import ToastService from "primevue/toastservice";

import { createApp } from "vue";
import { createPinia } from "pinia";

import router from "./router";
import App from "./App.vue";
import "./assets/tailwind.css";
import "./style.css";

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.use(pinia);

// app.component("InputText", InputText);
// app.component("Button", Button);
app.component("Editor", Editor);
app.component("Fieldset", Fieldset);
// app.component("FloatLabel", FloatLabel);
// app.component("Toast", Toast);
// app.component("ToggleSwitch", ToggleSwitch);
app.use(PrimeVue, { theme: "none" });
app.directive("styleclass", StyleClass);

app.mount("#app");
