import {createApp} from 'vue'
import App from './App.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import store from "@/store";
const options = {
};


const app = createApp(App)
app.use(store)
app.use(Toast, options);
app.use(VueAxios, axios)

app.mount('#app')
