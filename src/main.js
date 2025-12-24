import { createPinia } from "pinia"; // 导入Pinia
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// 创建Pinia实例
const pinia = createPinia();

app.use(pinia).use(router).mount("#app");