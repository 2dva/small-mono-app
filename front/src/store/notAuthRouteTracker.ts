import { defineStore } from 'pinia'
import { getSignInRoute, getSignOutRoute, getSignUpRoute } from '../lib/routes'

export interface RootState {
  lastVisitedNotAuthRoute: string
}

const authRoutes = [getSignInRoute(), getSignUpRoute(), getSignOutRoute()]

export const useNotAuthStore = defineStore('not_auth', {
  state: () =>
    ({
      lastVisitedNotAuthRoute: '',
    }) as RootState,
  getters: {
    getLastVisitedRoute(state) {
      return state.lastVisitedNotAuthRoute
    },
  },
  actions: {
    setRoute(route: string) {
      const isAuthRoute = authRoutes.includes(route)
      if (!isAuthRoute) {
        this.lastVisitedNotAuthRoute = route
      }
    },
  },
})
