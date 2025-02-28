import PrimeVue from "primevue/config";
import StyleClass from "primevue/styleclass";
import Editor from "primevue/editor";
import Fieldset from "primevue/fieldset";
import Chart from "primevue/chart";
import "primeicons/primeicons.css";
import ConfirmationService from "primevue/confirmationservice";
import Toast from "primevue/toast";
import DialogService from "primevue/dialogservice";
import ToastService from "primevue/toastservice";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./assets/tailwind.css";
import "./style.css";
import routerGuards from "./middlewares/auth.routes";

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(routerGuards);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.use(PrimeVue, { theme: "none" });

app.directive("styleclass", StyleClass);
app.component("Editor", Editor);
app.component("Fieldset", Fieldset);
app.component("Toast", Toast);
app.component("Chart", Chart);

app.mount("#app");
