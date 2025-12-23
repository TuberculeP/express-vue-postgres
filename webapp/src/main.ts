import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./lib/lang";
import { createPinia } from "pinia";
import "./assets/index.css";

const pinia = createPinia();

createApp(App).use(router).use(i18n).use(pinia).mount("#app");
