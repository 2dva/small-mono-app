<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import LogPanel from './components/LogPanel.vue'
import { nextTick, ref, watch } from 'vue'
import { TabsInst } from 'naive-ui'
import { useTRPC } from './lib/useTrpc'

const router = useRouter()
const route = useRoute()
const tabsInstRef = ref<TabsInst | null>(null)
const valueRef = ref('home')
const isAuthorized = ref<boolean | null>(null)

const trpc = useTRPC()
const { data, isLoading, isFetching, isError } = trpc.getMe.useQuery()

let signOutLabel = ''

watch(data, () => {
  const nickname = data.value?.me?.nick
  signOutLabel = `Sign out (${nickname})`
  if (isLoading.value || isFetching.value || isError.value) isAuthorized.value = null
  else isAuthorized.value = !!data.value?.me
  console.log(`App: data changed`, data.value, nickname, isAuthorized.value)
})

function onTabClick(value: string) {
  if (!router.hasRoute(value)) {
    router.push({ path: value })
    return
  }
  router.push({ name: value })
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
  { immediate: true } // Run the watcher immediately on component mount
)
</script>

<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-layout has-sider sider-placement="right" position="absolute">
          <n-layout-content content-style="padding: 0;">
            <nav>
              <n-card style="margin-bottom: 6px" :bordered="false" content-style="">
                <n-tabs ref="tabsInstRef" type="card" v-model:value="valueRef" animated @update:value="onTabClick">
                  <n-tab name="home" tab="Home" />
                  <n-tab name="posts" tab="Posts" />
                  <n-tab name="tree" tab="Tree render" />
                  <n-tab v-if="isAuthorized === false" name="signup" tab="Sign up" />
                  <n-tab v-if="isAuthorized === false" name="signin" tab="Sign in" />
                  <n-tab v-if="isAuthorized === true" name="signout" :tab="signOutLabel" />
                </n-tabs>
              </n-card>
            </nav>
            <main style="">
              <RouterView />
            </main>
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
