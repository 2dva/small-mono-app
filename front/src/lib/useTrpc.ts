import { createTRPCVueQueryClient } from '@falcondev-oss/trpc-vue-query'
import type { TrpcRouter } from '@small-mono-app/backend/src/router'
import { inject } from 'vue'

let authToken: string | null = null

export function useTRPC() {
  return inject('trpc') as ReturnType<typeof createTRPCVueQueryClient<TrpcRouter>>
}

export function setAuthToken(token: string | null) {
  authToken = token
}