import './assets/scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import MasonryWall from "@yeger/vue-masonry-wall";
import router from './router';

const app = createApp(App)
app.use(MasonryWall)
app.use(router)
app.mount('#app')
