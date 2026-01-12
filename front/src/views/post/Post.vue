<template>
  <div class="layout">
    <div class="left-menu">
      <n-menu :options="menuOptions" />
      <n-button type="primary" size="medium" @click="handleGenerateClick" style="margin: 8px">Generate</n-button>
    </div>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MenuOption } from 'naive-ui'
import { onMounted } from 'vue'
import { h } from 'vue'
import { inject } from 'vue'
import { RouterLink } from 'vue-router'
import { me } from '../../lib/injectionKeys'
import router from '../../lib/router'
import { getAllPostsRoute, getNewPostRoute } from '../../lib/routes'
import { useTRPC } from '../../lib/useTrpc'
import { usePosts } from '../../store/post'

const { myData } = inject(me)!

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: getAllPostsRoute() }, () => 'All posts'),
    key: 'post-all',
  },
  {
    label: () => h(RouterLink, { to: getNewPostRoute() }, () => 'New post'),
    key: 'post-add',
    show: myData.value !== null,
  },
]

const trpc = useTRPC()
const generateQuery = trpc.generatePosts.useQuery(() => {}, {
  enabled: false,
})

async function handleGenerateClick() {
  await generateQuery.refetch()
  router.push({ path: getAllPostsRoute() })
}

usePosts().init()

onMounted(() => {
  console.log(`Post:OnMounted`)
})
</script>

<style scoped>
.layout {
  position: relative;
  padding-top: 1px;
  display: flex;
}

.content {
  flex-grow: 1;
  margin: 10px;
  display: flex;
  justify-content: center;
}

.left-menu {
  width: 200px;
  border-right: 1px solid #eeeeee;
}
</style>
