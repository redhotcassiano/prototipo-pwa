import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './messaging_init_in_sw.js'

createApp(App).use(router).mount('#app')
