import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './app/App.vue'
import './app/globals.css'
import routes from '@/router'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
