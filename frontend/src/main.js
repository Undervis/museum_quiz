import './assets/scss/main.scss'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router';
import Toast, {POSITION} from 'vue-toastification'
import "vue-toastification/dist/index.css";
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const app = createApp(App)
app.use(router)
const toastOptions = {
    position: POSITION.BOTTOM_CENTER,
}
app.use(Toast, toastOptions)
app.component('QuillEditor', QuillEditor)
app.provide('api_url', 'http://localhost:8000/api')
app.mount('#app')
