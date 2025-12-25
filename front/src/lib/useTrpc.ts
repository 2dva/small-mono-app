import { createTRPCVueQueryClient } from '@falcondev-oss/trpc-vue-query'
import type { TrpcRouter } from '@small-mono-app/backend/src/router'
import { inject } from 'vue'


export function useTRPC() {
  return inject('trpc') as ReturnType<typeof createTRPCVueQueryClient<TrpcRouter>>
}