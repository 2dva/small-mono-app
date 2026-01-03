<script setup lang="ts">
import { useRouter } from 'vue-router';
import LogPanel from './components/LogPanel.vue'

const router = useRouter()

function onTabClick(value: string) {
  if (!router.hasRoute(value)) {
    router.push({ path: value })
    return
  }
  router.push({ name: value })
}

</script>

<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-layout has-sider sider-placement="right" position="absolute">
          <n-layout-content content-style="padding: 0;">
            <nav>
            <n-card style="margin-bottom: 6px" :bordered="false" content-style="">
              <n-tabs type="card" animated @update:value="onTabClick">
                <n-tab name="home" tab="Home" />
                <n-tab name="posts" tab="Posts" />
                <n-tab name="tree" tab="Tree render" />
                <n-tab name="todo" tab="Another tab" />
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
