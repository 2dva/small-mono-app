import { createTRPCVueQueryClient } from '@falcondev-oss/trpc-vue-query'
import type { TrpcRouter } from '@small-mono-app/backend/src/router'
import { useQueryClient } from '@tanstack/vue-query'
import { httpBatchLink, httpSubscriptionLink, loggerLink, splitLink } from '@trpc/client'
import Cookies from 'js-cookie'
import { App, inject } from 'vue'
import { env } from './env'

export const createTrpcClient = (app: App) => {
  const queryClient = app.runWithContext(useQueryClient)

  const trpc = createTRPCVueQueryClient<TrpcRouter>({
    queryClient,
    trpc: {
      links: [
        loggerLink({
          enabled: () => env.NODE_ENV === 'development' && false,
        }),
        splitLink({
          // uses the httpSubscriptionLink for subscriptions
          condition: (op) => op.type === 'subscription',
          true: httpSubscriptionLink({
            url: env.VITE_BACKEND_TRPC_URL,
          }),
          false: httpBatchLink({
            url: env.VITE_BACKEND_TRPC_URL,
            headers: () => {
              const token = Cookies.get('token')
              return {
                ...(token && { authorization: `Bearer ${token}` }),
              }
            },
          }),
        }),
      ],
    },
  })

  return trpc
}

export function useTRPC() {
  return inject('trpc') as ReturnType<typeof createTRPCVueQueryClient<TrpcRouter>>
}
