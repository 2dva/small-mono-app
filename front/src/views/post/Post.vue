<template>
  <div :class="$style['layout']">
    <div :class="$style['left-menu']">
      <n-menu :options="menuOptions" />
      <n-button type="primary" size="medium" @click="handleGenerateClick"  style="margin: 8px">Generate</n-button>
    </div>
    <div :class="$style['content']">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { usePosts } from '../../store/post'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { useTRPC } from '../../lib/useTrpc'
import router from '../../lib/router'
import { getAllPostsRoute, getNewPostRoute } from '../../lib/routes'
import { inject } from 'vue'
import { me } from '../../lib/injectionKeys'

const myData = inject(me)!

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
  router.push({ name: 'posts' })
}

usePosts().init()

onMounted(() => {
  console.log(`Post:OnMounted`)
})
</script>

<style module>
h1 {
  text-align: center;
}

.layout {
  position: relative;
  padding-top: 1px;
  display: flex;
}

.left-menu {
  width: 200px;
}

.content {
   flex-grow: 1;
}
</style>
