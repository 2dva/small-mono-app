<script setup lang="ts">
import { TrpcRouterOutput } from '@small-mono-app/backend/src/router'
import { throttle } from 'lodash'
import { provide, ref, watch } from 'vue'
import LogPanel from './components/LogPanel.vue'
import TopNavigation from './components/TopNavigation.vue'
import { me } from './lib/injectionKeys'
import { layoutScrollEvent } from './lib/scrollEventEmitter'
import { useTRPC } from './lib/useTrpc'
import { MixpanelUser } from './lib/mixpanel'

const myData = ref<TrpcRouterOutput['getMe']['me']>(null)
const setMyData = (data: TrpcRouterOutput['getMe']['me']) => {
  myData.value = data
}

const trpc = useTRPC()
const { data, isLoading, isFetching, isError, error } = trpc.getMe.useQuery(() => {}, {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
})

watch(data, () => {
  if (data.value?.me !== undefined) {
    myData.value = data.value.me
    MixpanelUser(myData.value)
  }
})

const handleLoad = throttle(() => { layoutScrollEvent.emit() }, 200, { trailing: false })

provide(me, { myData, setMyData })

MixpanelUser(myData.value)
</script>

<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-layout has-sider sider-placement="right" position="absolute">
          <n-layout-content content-style="padding: 0; position: relative;">
            <n-infinite-scroll class="scrollable" :distance="150" @load="handleLoad">
              <TopNavigation />
              <main :style="{ padding: '10px'}">
                <n-space v-if="isLoading || isFetching" justify="center">
                  <n-spin size="medium" />
                </n-space>
                <n-alert v-else-if="isError" title="Error" type="error">
                  {{ error }}
                </n-alert>
                <RouterView v-else />
              </main>
            </n-infinite-scroll>
          </n-layout-content>
          <n-layout-sider
            collapse-mode="transform"
            :native-scrollbar="false"
            :collapsed-width="200"
            :width="440"
            show-trigger="bar"
            content-style="padding: 0; height: 100%;"
            bordered
            default-collapsed
          >
            <LogPanel />
          </n-layout-sider>
        </n-layout>
      </n-notification-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>

<style scoped>
.scrollable {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
