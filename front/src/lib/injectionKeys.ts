import { TrpcRouterOutput } from '@small-mono-app/backend/src/router'
import type { InjectionKey, Ref } from 'vue'

export const me: InjectionKey<Ref<TrpcRouterOutput['getMe']['me']>> = Symbol('my-profile')
