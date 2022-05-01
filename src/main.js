import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/scss/main.scss";
import "bootstrap";
import axios from "axios";
import VueAxios from "vue-axios";
import x2js from "x2js";

const app = createApp(App);
app.use(VueAxios, axios);
app.mount("#app");
app.config.globalProperties.$x2js = new x2js();

document.title = "找快篩｜快篩試劑地圖";
