<script setup lang="ts">
import { TrpcRouterOutput } from '@small-mono-app/backend/src/router'
import { TabsInst } from 'naive-ui'
import { nextTick, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogPanel from './components/LogPanel.vue'
import { me } from './lib/injectionKeys'
import { useTRPC } from './lib/useTrpc'
import { layoutScrollEvent } from './lib/scrollEventEmitter'
import LogoBlog from './assets/images/logo-blogger.svg?component'

const router = useRouter()
const route = useRoute()
const tabsInstRef = ref<TabsInst | null>(null)
const valueRef = ref('home')
const myData = ref<TrpcRouterOutput['getMe']['me']>(null)
const setMyData = (data: TrpcRouterOutput['getMe']['me']) => {
  myData.value = data
}

const trpc = useTRPC()
const { data, isLoading, isFetching, isError } = trpc.getMe.useQuery(() => {}, {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
})

watch(data, () => {
  if (data.value?.me !== undefined) {
    myData.value = data.value.me
  }
})

function onTabClick(value: string) {
  if (router.hasRoute(value)) {
    router.push({ name: value })
  } else {
    router.push({ path: value })
  }
}

function updateTabTo(name: string) {
  valueRef.value = name
  nextTick(() => tabsInstRef.value?.syncBarPosition())
}

watch(
  () => route.fullPath,
  () => {
    updateTabTo(String(route.name))
  },
  { immediate: true }
)

function handleLoad() {
  layoutScrollEvent.emit()
}

provide(me, { myData, setMyData })
</script>

<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-layout has-sider sider-placement="right" position="absolute">
          <n-layout-content content-style="padding: 0; position: relative;">
            <n-infinite-scroll class="scrollable" :distance="150" @load="handleLoad">
              <nav class="nav">
                <div class="logo">
                  <LogoBlog />
                </div>
                <n-card style="margin-bottom: 6px" :bordered="false" content-style="">
                  <n-tabs ref="tabsInstRef" type="card" v-model:value="valueRef" animated @update:value="onTabClick">
                    <n-tab name="home" tab="Home" />
                    <n-tab name="posts" tab="Posts" />
                    <n-tab name="tree" tab="Tree render" />
                    <n-tab v-if="!myData" name="signup" tab="Sign up" />
                    <n-tab v-if="!myData" name="signin" tab="Sign in" />
                    <n-tab v-if="myData" name="profile-edit" tab="Edit profile" />
                    <n-tab v-if="myData" name="change-pswd" tab="Change password" />
                    <n-tab v-if="myData" name="signout" :tab="`Sign out (${myData?.nick})`" />
                  </n-tabs>
                </n-card>
              </nav>
              <main style="">
                <n-space v-if="isLoading || isFetching" justify="center">
                  <n-spin size="medium" />
                </n-space>
                <div v-else-if="isError">Error</div>
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
.nav {
  display: flex;
}
.logo {
  margin: 16px;
  width: 48px;
  height: 48px;
}
.logo svg { 
  width: 100%;
  height: auto;
}
.scrollable {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
