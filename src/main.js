import { createPinia } from "pinia"; // 导入Pinia
import { createApp } from "vue";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(pinia).use(router).mount("#app");