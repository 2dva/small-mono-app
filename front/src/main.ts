import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { createNaiveBundle } from './lib/naive'
import router from './lib/router'
import { createTrpcClient } from './lib/useTrpc'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createNaiveBundle())
app.use(VueQueryPlugin)
app.use({
  install(app) {
    app.provide('trpc', createTrpcClient(app))
  },
})

app.mount('#app')
