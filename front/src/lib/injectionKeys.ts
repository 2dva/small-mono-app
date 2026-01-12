import { TrpcRouterOutput } from '@small-mono-app/backend/src/router'
import type { InjectionKey, Ref } from 'vue'

interface ProfileContext {
  myData: Ref<TrpcRouterOutput['getMe']['me']>
  setMyData: (data: TrpcRouterOutput['getMe']['me']) => void
}

export const me: InjectionKey<ProfileContext> = Symbol('my-profile')
