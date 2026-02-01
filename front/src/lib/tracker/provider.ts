import { TrpcRouterOutput } from '@small-mono-app/backend/src/router'

export interface TrackerProvider {
  isEnabled(): boolean
  init(): void
  identify(s: string): void
  alias(s: string): void
  reset(): void
  track(data: any): void
  setMyProfile(s: TrackerProfileData | null): void
}

export enum TrackerProviderEvents {
  'init',
  'identify',
  'alias',
  'reset',
  'track',
  'setMyProfile',
}

export type TrackerProfileData = {
  email: string
  [key: string]: any
}

let trackerProvider: TrackerProvider | null = null

export const registerTrackerProvider = (provider: TrackerProvider) => {
  trackerProvider = provider
}

export const setMyProfileData = (me: TrpcRouterOutput['getMe']['me']) => {
  trackerProvider?.setMyProfile(me as TrackerProfileData | null)
}

export const invokeTrackerProviderEvent = (
  trackerEvent: TrackerProviderEvents,
  idOrEventName: string = '',
  data?: any
) => {
  switch (trackerEvent) {
    case TrackerProviderEvents.identify:
      trackerProvider?.identify(data)
      break
    case TrackerProviderEvents.setMyProfile:
      trackerProvider?.setMyProfile(data)
      break
  }
}
