<template>
  <nav class="nav">
    <div class="logo">
      <LogoBlog />
    </div>
    <n-card style="margin-bottom: 6px" :bordered="false">
      <n-tabs ref="tabsInstRef" type="card" v-model:value="valueRef" animated @update:value="onTabClick">
        <n-tab name="home" tab="Home" />
        <n-tab name="posts" tab="Posts" />
        <n-tab name="tree" tab="Tree render" />
        <n-tab v-if="!myData" name="signup" tab="Sign up" />
        <n-tab v-if="!myData" name="signin" tab="Sign in" />
        <n-tab v-if="myData" name="profile" tab="Profile" />
        <n-tab v-if="myData" name="signout" :tab="`Sign out (${myData?.nick})`" />
      </n-tabs>
    </n-card>
  </nav>
</template>

<script setup lang="ts">
import { TabsInst } from 'naive-ui'
import { inject, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { me } from '../lib/injectionKeys'
import { useNotAuthStore } from '../store/notAuthRouteTracker'
import LogoBlog from '../assets/images/logo-blogger.svg?component'

const router = useRouter()
const valueRef = ref('home')
const tabsInstRef = ref<TabsInst | null>(null)
const { myData } = inject(me)!
const route = useRoute()
const notAuthStore = useNotAuthStore()

function updateTabTo(name: string) {
  valueRef.value = name
  nextTick(() => tabsInstRef.value?.syncBarPosition())
}

function onTabClick(value: string) {
  if (router.hasRoute(value)) {
    router.push({ name: value })
  } else {
    router.push({ path: value })
  }
}

watch(
  () => route.fullPath,
  () => {
    updateTabTo(String(route.name))
    notAuthStore.setRoute(route.fullPath)
  },
  { immediate: true }
)
</script>

<style scoped>
.nav {
  display: flex;
}
.logo {
  margin: 16px 8px 16px 20px;
  width: 48px;
  height: 48px;
}
.logo svg {
  width: 100%;
  height: auto;
}
</style>
