import { createTRPCVueQueryClient } from '@falcondev-oss/trpc-vue-query'
import { App, inject } from 'vue'
import type { TrpcRouter } from '@small-mono-app/backend/src/router'
import { useQueryClient } from '@tanstack/vue-query'
import { httpBatchLink, httpSubscriptionLink, splitLink } from '@trpc/client'
import Cookies from 'js-cookie'

export const createTrpcClient = (app: App) => {
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
