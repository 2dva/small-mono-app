import './style.css'
import { createTRPCVueQueryClient } from '@falcondev-oss/trpc-vue-query'
import type { TrpcRouter } from '@small-mono-app/backend/src/router'
import { VueQueryPlugin, useQueryClient } from '@tanstack/vue-query'
import { httpBatchLink, httpSubscriptionLink, splitLink } from '@trpc/client'
import naive from "naive-ui";
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.use(naive);
app.use(VueQueryPlugin)
app.use({
  install(app) {
    const queryClient = app.runWithContext(useQueryClient)
    const trpc = createTRPCVueQueryClient<TrpcRouter>({
      queryClient,
      trpc: {
        links: [
          splitLink({
            // uses the httpSubscriptionLink for subscriptions
            condition: (op) => op.type === 'subscription',
            true: httpSubscriptionLink({
              url: `http://localhost:3000/trpc`,
            }),
            false: httpBatchLink({
              url: `http://localhost:3000/trpc`,
            }),
          }),
          // httpBatchLink({
          //   url: 'http://localhost:3000/trpc',
          // }),
        ],
      },
    })

    app.provide('trpc', trpc)
  },
})


app.mount('#app')
