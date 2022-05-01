import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/scss/main.scss'
import "bootstrap"
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App);
app.use(VueAxios, axios);
app.mount('#app');